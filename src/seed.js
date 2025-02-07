import mongoose from 'mongoose';
import Product from './dao/models/product.model.js';
import { config } from './config/config.js';
import loggerUtil from './utils/logger.util.js';

const MONGO_URI = config.MONGO_URL;

const products = [
    { code: "P001", title: "Laptop HP Pavilion", description: "Laptop con pantalla de 15.6 pulgadas y 8GB RAM", price: 700, category: "Tecnología", stock: 20, status: true, thumbnail: "" },
    { code: "P002", title: "Cafetera Nespresso", description: "Cafetera automática para cápsulas Nespresso", price: 120, category: "Hogar", stock: 15, status: true, thumbnail: "" },
    { code: "P003", title: "Camiseta Nike", description: "Camiseta deportiva de algodón para hombre", price: 25, category: "Vestuario", stock: 50, status: true, thumbnail: "" },
    { code: "P004", title: "Televisor Samsung 50\"", description: "Televisor LED 4K con Smart TV", price: 450, category: "Tecnología", stock: 10, status: true, thumbnail: "" },
    { code: "P005", title: "Colchón King Size", description: "Colchón ergonómico con memoria de forma", price: 300, category: "Hogar", stock: 8, status: true, thumbnail: "" },
    { code: "P006", title: "Bicicleta Montaña", description: "Bicicleta de montaña con marco de aluminio", price: 250, category: "Deporte", stock: 5, status: true, thumbnail: "" },
    { code: "P007", title: "Auriculares Bluetooth", description: "Auriculares inalámbricos con micrófono", price: 60, category: "Tecnología", stock: 25, status: true, thumbnail: "" },
    { code: "P008", title: "Sofá 3 plazas", description: "Sofá de tela color gris, con cojines incluidos", price: 400, category: "Hogar", stock: 7, status: true, thumbnail: "" },
    { code: "P009", title: "Polo Adidas", description: "Polo deportivo de algodón para mujer", price: 20, category: "Vestuario", stock: 40, status: true, thumbnail: "" },
    { code: "P010", title: "Smartphone Xiaomi", description: "Teléfono inteligente con 128GB de almacenamiento", price: 300, category: "Tecnología", stock: 15, status: true, thumbnail: "" },
    { code: "P011", title: "Mesa de Centro", description: "Mesa de centro de madera para sala de estar", price: 80, category: "Hogar", stock: 12, status: true, thumbnail: "" },
    { code: "P012", title: "Pelota de Fútbol", description: "Pelota oficial de fútbol para césped", price: 30, category: "Deporte", stock: 35, status: true, thumbnail: "" },
    { code: "P013", title: "Tablet Samsung Galaxy", description: "Tablet con pantalla de 10.1 pulgadas", price: 200, category: "Tecnología", stock: 18, status: true, thumbnail: "" },
    { code: "P014", title: "Batidora Oster", description: "Batidora de mano con 5 velocidades", price: 45, category: "Hogar", stock: 20, status: true, thumbnail: "" },
    { code: "P015", title: "Zapatillas Reebok", description: "Zapatillas para correr con amortiguación", price: 75, category: "Deporte", stock: 22, status: true, thumbnail: "" },
    { code: "P016", title: "Camisa Formal", description: "Camisa de algodón para hombre, manga larga", price: 35, category: "Vestuario", stock: 30, status: true, thumbnail: "" },
    { code: "P017", title: "Monitor Dell 24\"", description: "Monitor LED con resolución Full HD", price: 180, category: "Tecnología", stock: 14, status: true, thumbnail: "" },
    { code: "P018", title: "Almohada de Memoria", description: "Almohada ortopédica de memoria para cuello", price: 25, category: "Hogar", stock: 25, status: true, thumbnail: "" },
    { code: "P019", title: "Guantes de Boxeo", description: "Guantes de boxeo profesionales de cuero", price: 50, category: "Deporte", stock: 10, status: true, thumbnail: "" },
    { code: "P020", title: "Falda Floral", description: "Falda con estampado floral para mujer", price: 40, category: "Vestuario", stock: 20, status: true, thumbnail: "" },
    { code: "P021", title: "Impresora HP", description: "Impresora multifuncional con Wi-Fi", price: 90, category: "Tecnología", stock: 15, status: true, thumbnail: "" },
    { code: "P022", title: "Silla de Oficina", description: "Silla ergonómica con soporte lumbar", price: 120, category: "Hogar", stock: 12, status: true, thumbnail: "" },
    { code: "P023", title: "Raqueta de Tenis", description: "Raqueta de tenis profesional con grip", price: 60, category: "Deporte", stock: 18, status: true, thumbnail: "" },
    { code: "P024", title: "Abrigo de Invierno", description: "Abrigo de lana para invierno, color negro", price: 100, category: "Vestuario", stock: 12, status: true, thumbnail: "" },
    { code: "P025", title: "Cámara Canon EOS", description: "Cámara profesional DSLR con 24MP", price: 500, category: "Tecnología", stock: 5, status: true, thumbnail: "" },
    { code: "P026", title: "Plancha de Vapor", description: "Plancha de ropa con función de vapor", price: 35, category: "Hogar", stock: 25, status: true, thumbnail: "" },
    { code: "P027", title: "Balón de Baloncesto", description: "Balón de baloncesto para exteriores", price: 25, category: "Deporte", stock: 20, status: true, thumbnail: "" },
    { code: "P028", title: "Jeans Levi's", description: "Jeans rectos de mezclilla para hombre", price: 60, category: "Vestuario", stock: 30, status: true, thumbnail: "" },
    { code: "P029", title: "Drone DJI Mini", description: "Drone compacto con cámara 4K", price: 400, category: "Tecnología", stock: 10, status: true, thumbnail: "" },
    { code: "P030", title: "Lampara de Pie", description: "Lámpara de pie moderna para sala de estar", price: 70, category: "Hogar", stock: 8, status: true, thumbnail: "" }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        await Product.deleteMany({});
        loggerUtil.INFO('Collection eliminada!');

        await Product.insertMany(products);
        loggerUtil.INFO(`Productos agregados a la DB ${config.DB_NAME}`);;

        mongoose.disconnect();
    } catch (error) {
        loggerUtil.FATAL('Error:', error);
        process.exit(1);
    }
};

seedDatabase();