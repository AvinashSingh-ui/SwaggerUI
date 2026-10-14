import express from "express";
import cors from "cors";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

writeFileSync(
  join(__dirname, "openapi.json"),
  JSON.stringify(swaggerSpec, null, 2)
);

const app=express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve OpenAPI spec for client generation
app.get("/openapi.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(readFileSync(join(__dirname, "openapi.json")));
});

const port = process.env.PORT || 3000;

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 3999,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
  },
  {
    id: 3,
    name: "Laptop",
    price: 54999,
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
  },
  {
    id: 4,
    name: "Smartphone",
    price: 29999,
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 1999,
    image: "https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg",
  },
  {
    id: 6,
    name: "Mechanical Keyboard",
    price: 3499,
    image: "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg",
  },
  {
    id: 7,
    name: "Gaming Mouse",
    price: 1499,
    image: "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg",
  },
  {
    id: 8,
    name: "Tablet",
    price: 18999,
    image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg",
  },
  {
    id: 9,
    name: "Digital Camera",
    price: 42999,
    image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
  },
  {
    id: 10,
    name: "Power Bank",
    price: 999,
    image: "https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg",
  },
];

app.get('/api/products',(req,res)=>{
    const searchTerm = req.query.search ? String(req.query.search).trim().toLowerCase() : "";
    if(searchTerm){
     const filteredProducts = products.filter((product)=>product.name.toLowerCase().includes(searchTerm));
     res.send(filteredProducts);
     return;
    }
    setTimeout(()=>{
        res.send(products);
    },3000);
}
);
app.post('/api/products',(req,res)=>{
   const {name,price,image}=req.body;
   if (!name || price == null || !image) {
    return res.status(400).json({
      message: "Name, price and image are required",
    });
  }
  const newProduct={
    id: Date.now(),
    name,
    price:Number(price),
    image,
  };
  products.push(newProduct);

  res.status(201).json({
    message:"Product Created Successfully",
    product:newProduct,
  });

});

app.put("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);

  const productIndex = products.findIndex(
    (product) => product.id === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const { name, price, image } = req.body;

  if (!name || price == null || !image) {
    return res.status(400).json({
      message: "Name, price and image are required",
    });
  }

  const updatedProduct = {
    id: productId,
    name,
    price: Number(price),
    image,
  };

  products[productIndex] = updatedProduct;

  return res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});
app.delete("/api/products/:id",(req,res)=>{
    const productId=Number(req.params.id);

    const productIndex=products.findIndex((product)=>product.id===productId);

    if(productIndex === -1){
        return res.status(404).json({
            message:"Product not found",
        })
    }
    products.splice(productIndex,1);

    return res.status(200).json({
        message:"Product deleted Successfully"
    })
})

app.listen(port,()=>{
    console.log(`Server Runnning on port ${port}`);
})