# CS Connect Documentation

This repository contains the official documentation for the CS Connect application, a comprehensive platform for computer science resources, faculty connections, and career development at MSU Denver.

## Overview

The documentation is built using [VitePress](https://vitepress.dev/), a static site generator powered by Vue.js. It provides detailed guides on setting up and using the CS Connect application.

## Documentation Contents

- **Frontend Setup Guide**: Instructions for setting up and running the CS Connect frontend application
- **Supabase Setup Guide**: Step-by-step guide for configuring the Supabase backend
- **Additional Resources**: Links to relevant external documentation

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/4360-senior-experience/cs-connect-documentation.git
   cd cs-connect-documentation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run docs:dev
   ```

4. Open your browser and visit `http://localhost:5173` (or the URL shown in your terminal)

### Building for Production

To build the documentation for production:

```bash
npm run docs:build
```

The built files will be in the `.vitepress/dist` directory.

## Contributing

Contributions to improve the documentation are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes
4. Submit a pull request

## Related Repositories

- [CS Connect Frontend](https://github.com/4360-senior-experience/cs-connect)

## License

This documentation is licensed under the MIT License.
