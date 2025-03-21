## Getting Started

To set up and run this project:

1. Install dependencies:
   ```
   npm install
   ```

2. Start the required Docker containers:
   ```
   npm run start:docker
   ```

3. Ensure WALLET_TOOLBOX is running on port 8100:
   > **IMPORTANT**: The WALLET_TOOLBOX must be running on port 8100 before starting the overlay service application.
   > This URL can be updated in the OverlayExpress file if needed.
   > If WALLET_TOOLBOX is not running, the overlay service application will not be able to connect.

4. Start the application in development mode:
   ```
   npm run start:dev
   ```
