# Draculotto - Sistema de Predicción de Números

## Descripción del Proyecto

Draculotto es una aplicación web moderna diseñada para gestionar y consultar números de lotería. El sistema permite a los usuarios:

- Consultar números de salida asociados a números de entrada
- Panel de administración para gestionar referencias numéricas
- Interfaz elegante y responsiva con efectos visuales
- Base de datos SQLite para almacenamiento persistente

## Tecnologías Utilizadas

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn-ui (Componentes UI)
- Vite (Build tool)

### Backend
- Node.js
- Express
- SQLite

## Estructura del Proyecto

```
wilmer-casino/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas de la aplicación
│   └── styles/         # Estilos CSS
├── server/
│   ├── config/        # Configuración de la base de datos
│   └── index.js       # Servidor Express
└── database.sqlite    # Base de datos SQLite
```

## Instalación y Uso

1. Clonar el repositorio:
```bash
git clone https://github.com/julianguill/wilmer-casino.git
```

2. Instalar dependencias:
```bash
cd wilmer-casino
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. En otra terminal, iniciar el servidor backend:
```bash
cd server
node index.js
```

## Características

### Panel de Usuario
- Interfaz intuitiva para consultar números
- Visualización clara de los números de salida
- Animaciones y efectos visuales

### Panel de Administración
- CRUD completo para referencias numéricas
- Validación de datos
- Feedback visual de operaciones

## Base de Datos

La aplicación utiliza SQLite con la siguiente estructura:

```sql
CREATE TABLE reference_numbers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    input VARCHAR(2) NOT NULL,
    outputs TEXT NOT NULL
);
```

## Contribución

Si deseas contribuir al proyecto:

1. Haz un Fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.
