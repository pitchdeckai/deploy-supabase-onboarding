@echo off
echo === Starting ngrok tunnel for Stripe webhooks ===
echo.
echo Starting ngrok tunnel on port 3000...
echo.
ngrok http 3000
pause
