#!/usr/bin/env python3
# seed_mongo.py

import random
import datetime
from pymongo import MongoClient

# —————————————————————————————————————————
# CONFIGURA TU URI AQUÍ
MONGO_URI = "mongodb+srv://garciasalasperezjulio:1234@lab1.ka8t9.mongodb.net/Restaurante?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client.get_database()

# —————————————————————————————————————————
# PARÁMETROS DE CANTIDAD
N_USUARIOS = 10000
N_ORDENES  = 1000
N_RESENAS  = 50000

# —————————————————————————————————————————
# DATOS DE EJEMPLO
calles    = ["Av. Principal", "Calle Secundaria", "Paseo de la Reforma", "Camino Real"]
ciudades  = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"]
nombres   = ["María", "Juan", "Ana", "Luis", "Carmen", "Carlos", "Lucía", "Miguel"]
apellidos = ["García", "Rodríguez", "Martínez", "López", "Sánchez", "Pérez"]
comentarios = [
    "¡Excelente servicio y comida deliciosa!",
    "Muy buena experiencia, aunque tardó un poco.",
    "La app funcionó perfecto y la comida llegó caliente.",
    "¡La mejor paella que he probado!",
    "Repetiré sin dudarlo, súper recomendado."
]

# —————————————————————————————————————————
# 1) INSERTAR EL RESTAURANTE
rest_doc = {
    "nombre": "Mamis Restaurant",
    "direccion": f"{random.randint(1,200)} {random.choice(calles)}, {random.choice(ciudades)}",
    "ubicacion": {
        "lat": round(random.uniform(-90,90),6),
        "lng": round(random.uniform(-180,180),6)
    },
    "telefono": f"+34 {random.randint(600,799)}-{random.randint(100,999)}-{random.randint(100,999)}",
    "email": "info@mamisrestaurant.com",
    "horario": [
        {"dia":"Lunes","apertura":"10:00","cierre":"22:00"},
        {"dia":"Martes","apertura":"10:00","cierre":"22:00"},
        {"dia":"Miércoles","apertura":"10:00","cierre":"22:00"},
        {"dia":"Jueves","apertura":"10:00","cierre":"22:00"},
        {"dia":"Viernes","apertura":"10:00","cierre":"23:00"},
        {"dia":"Sábado","apertura":"11:00","cierre":"23:00"},
        {"dia":"Domingo","apertura":"12:00","cierre":"21:00"}
    ]
}
resto_id = db.restaurantes.insert_one(rest_doc).inserted_id
print("Restaurante insertado:", resto_id)

# —————————————————————————————————————————
# 2) GENERAR Y INSERTAR USUARIOS
usuarios = []
for i in range(N_USUARIOS):
    usuarios.append({
        "nombre": random.choice(nombres),
        "apellido": random.choice(apellidos),
        "email": f"user{i}@ejemplo.com",
        "telefono": f"+34 {random.randint(600,799)}-{random.randint(100,999)}-{random.randint(100,999)}",
        "direccion": f"{random.randint(1,500)} {random.choice(calles)}, {random.choice(ciudades)}",
        "nit": str(random.randint(10_000_000,99_999_999)),
        "fechaRegistro": datetime.datetime.utcnow(),
        "password": "HASHED_PASSWORD_PLACEHOLDER",
        "rol": random.choice(["admin","user"])
    })
res = db.usuarios.insert_many(usuarios)
user_ids = res.inserted_ids
print(f"{len(user_ids)} usuarios insertados")

# —————————————————————————————————————————
# 3) CARGAR ARTÍCULOS DEL MENÚ YA EXISTENTES
articulos = list(db.articulos_menu.find({}, {"_id":1,"nombre":1,"precio":1}))
print(f"{len(articulos)} artículos del menú cargados")

# —————————————————————————————————————————
# 4) GENERAR Y INSERTAR ÓRDENES
ordenes = []
for _ in range(N_ORDENES):
    usr = random.choice(user_ids)
    # siempre apuntan al mismo restaurante
    rst = resto_id
    # muestras de 1–5 artículos
    muestra = random.sample(articulos, k=random.randint(1,5))
    items = []
    total = 0
    for art in muestra:
        qty = random.randint(1,3)
        precio = art["precio"]
        total += qty * precio
        items.append({
            "menuItemId": art["_id"],
            "nombre": art["nombre"],
            "cantidad": qty,
            "precio": precio
        })
    ordenes.append({
        "usuarioId": usr,
        "restauranteId": rst,
        "fecha": datetime.datetime.utcnow(),
        "estado": random.choice(["confirmado","en preparación","entregado","cancelado"]),
        "total": round(total,2),
        "articulos": items
    })
res = db.ordenes.insert_many(ordenes)
order_ids = res.inserted_ids
print(f"{len(order_ids)} órdenes insertadas")

# —————————————————————————————————————————
# 5) GENERAR Y INSERTAR RESEÑAS
resenas = []
for _ in range(N_RESENAS):
    usr = random.choice(user_ids)
    rst = resto_id
    # 80% de ellas referencian una orden existente
    orden = random.choice(order_ids) if random.random() < 0.8 else None
    doc = {
        "usuarioId": usr,
        "restauranteId": rst,
        # si no hay orden, omitimos la clave
        **({"ordenId": orden} if orden else {}),
        "calificacion": random.randint(1,5),
        "comentario": random.choice(comentarios),
        "fecha": datetime.datetime.utcnow()
    }
    resenas.append(doc)
res = db.resenas.insert_many(resenas)
print(f"{len(res.inserted_ids)} reseñas insertadas")

# —————————————————————————————————————————
print("✅ ¡Precarga completada!")
