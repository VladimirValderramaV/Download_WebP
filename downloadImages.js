/* Script para descargar imagenes de articulo de noticias y exportarlas a formato 
jpg, ya que estas suelen estar en formato webp*/

/* IMPORTANTE: Instalar las dependencias necesarias*/

// npm install axios cheerio sharp fs



const axios = require('axios');
const cheerio = require('cheerio');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// URL del artículo que quieres descargar
const url = "https://www.bbc.com/mundo/articles/cgl7xl2p1y8o";

// Carpeta de salida
const outputFolder = "C:/Users/vladi/OneDrive/Escritorio/Inspiracion/Paris 2024";

// Función para descargar y convertir imágenes
async function downloadArticleImages(url) {
    try {
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }

        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Filtrar solo imágenes dentro del artículo
        const images = $('img'); // Todas las imágenes

        console.log(`${images.length} imágenes encontradas.`);

        let imageIndex = 1;
        for (const img of images) {
            let imgUrl = $(img).attr('src');

            if (imgUrl && !imgUrl.startsWith('http')) {
                const baseUrl = new URL(url).origin;
                imgUrl = `${baseUrl}${imgUrl}`;
            }

            console.log(`Descargando: ${imgUrl}`);
            const imageResponse = await axios({
                url: imgUrl,
                responseType: 'arraybuffer'
            });

            const imageBuffer = Buffer.from(imageResponse.data);

            // Convertir a JPG si es WebP, mantener formato si no lo es
            const outputPath = path.join(outputFolder, `image_${imageIndex}.jpg`);
            await sharp(imageBuffer)
                .toFormat('jpeg')
                .toFile(outputPath);

            console.log(`Imagen guardada: ${outputPath}`);
            imageIndex++;
        }
    } catch (error) {
        console.error("Error descargando imágenes:", error);
    }
}

// Ejecutar la función
downloadArticleImages(url);
