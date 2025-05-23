const supabase = require('./supabase');

exports.handler = async function(event, context) {
  console.log('Event received:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers
  });

  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      console.log('Attempting to fetch reference numbers...');
      
      // Verificar conexión a Supabase
      try {
        const { data: testData, error: testError } = await supabase
          .from('reference_numbers')
          .select('count');

        if (testError) {
          console.error('Database connection test failed:', testError);
          throw new Error('Database connection failed');
        }
        console.log('Database connection test successful');
      } catch (testError) {
        console.error('Error testing database connection:', testError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Database connection failed' })
        };
      }

      // Obtener todos los números de referencia
      const { data, error } = await supabase
        .from('reference_numbers')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Error fetching data' })
        };
      }

      console.log('Data retrieved:', data);

      if (!data || !Array.isArray(data)) {
        console.error('Invalid data format received:', data);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Invalid data format' })
        };
      }

      // Transformar los datos al formato esperado por el frontend
      const references = data.map(ref => ({
        input: ref.input_number,
        outputs: [ref.output_number1, ref.output_number2, ref.output_number3]
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(references)
      };
    }

    // Manejar otros métodos HTTP si es necesario
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error', error: error.message })
    };
  }
};
