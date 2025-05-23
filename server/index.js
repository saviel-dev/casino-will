import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Get all reference numbers
app.get('/api/references', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM reference_numbers ORDER BY created_at DESC');
    const formattedRows = rows.map(row => ({
      id: row.id,
      input: row.input_number,
      outputs: [row.output_number1, row.output_number2, row.output_number3]
    }));
    res.json(formattedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new reference number
app.post('/api/references', async (req, res) => {
  const { input, outputs } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO reference_numbers (input_number, output_number1, output_number2, output_number3) VALUES (?, ?, ?, ?)',
      [input, outputs[0], outputs[1], outputs[2]]
    );
    res.json({ id: result.lastID, input, outputs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update reference number
app.put('/api/references/:id', async (req, res) => {
  const { id } = req.params;
  const { input, outputs } = req.body;
  try {
    await db.run(
      'UPDATE reference_numbers SET input_number = ?, output_number1 = ?, output_number2 = ?, output_number3 = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [input, outputs[0], outputs[1], outputs[2], id]
    );
    res.json({ id: parseInt(id), input, outputs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete reference number
app.delete('/api/references/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM reference_numbers WHERE id = ?', [id]);
    res.json({ message: 'Reference deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
