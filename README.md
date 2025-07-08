Praca nad zadaniem trwała około 4 godziny, najwięcej czasu poświęciłem na zrozumienie polecenia i jak funkcjonuje to Api.

## Uruchamianie w Dockerze

1. Utwórz plik `.env` na podstawie `.env.example`.
2. Zbuduj obraz: `docker build -t orders-app .`
3. Uruchom: `docker run --env-file .env -p 3000:3000 orders-app`


lub 

1. Utwórz plik `.env` na podstawie `.env.example`.
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom aplikację:
   ```bash
   node app.js
   ```