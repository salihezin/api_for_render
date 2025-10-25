# Temel imaj (Node 18 önerilir)
FROM node:18

# Çalışma dizinini oluştur
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Diğer tüm dosyaları kopyala
COPY . .

# Uygulamanın dinleyeceği portu belirt
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"]
