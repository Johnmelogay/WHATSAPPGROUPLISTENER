FROM ghcr.io/puppeteer/puppeteer:latest
USER root
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Render uses the PORT environment variable
EXPOSE 10000 
CMD ["node", "bot.js"]
