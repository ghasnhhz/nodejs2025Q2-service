  FROM node:20-alpine AS builder

  WORKDIR /app
  
  COPY package*.json ./
  
  RUN npm ci --omit=dev
  
  COPY . .
  
  FROM node:20-alpine
  
  WORKDIR /app
  
  COPY --from=builder /app ./
  
  EXPOSE 4000
  
  CMD ["npm", "start"]