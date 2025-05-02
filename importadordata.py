#!/usr/bin/env python3
# seed_mongo.py

import random
import datetime
from pymongo import MongoClient
from datetime import timezone

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
    "Los tacos al pastor estuvieron increíbles!",
    "Muy buena variedad de tacos y salsas.",
    "Los tacos llegaron un poco fríos, pero estaban sabrosos.",
    "Me encantaron los tacos de carnitas, repetiré seguro.",
    "Buena atención, aunque los tacos tardaron algo en llegar."
]

# —————————————————————————————————————————
# 1) INSERTAR 5 RESTAURANTES
restaurantes_info = [
    "Mamis Restaurant - Centro",
    "Mamis Restaurant - Norte",
    "Mamis Restaurant - Sur",
    "Mamis Restaurant - Este",
    "Mamis Restaurant - Oeste"
]
resto_ids = []
for nombre in restaurantes_info:
    doc = {
        "nombre": nombre,
        "direccion": f"{random.randint(1,200)} {random.choice(calles)}, {random.choice(ciudades)}",
        "ubicacion": {
            "lat": round(random.uniform(-90,90),6),
            "lng": round(random.uniform(-180,180),6)
        },
        "telefono": f"+34 {random.randint(600,799)}-{random.randint(100,999)}-{random.randint(100,999)}",
        "email": f"info@{nombre.lower().replace(' ', '')}.com",
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
    rid = db.restaurantes.insert_one(doc).inserted_id
    resto_ids.append(rid)
print(f"{len(resto_ids)} restaurantes insertados.")

# —————————————————————————————————————————
# 2) CREAR USUARIOS FIJOS + ALEATORIOS
usuarios = [
    # Julio y Sofi
    {
      "nombre": "Julio",
      "apellido": "García",
      "email": "julio@ejemplo.com",
      "password": "1234",
      "rol": "admin",
      "nit": "12345678",
      "fechaRegistro": datetime.datetime.now(timezone.utc)
    },
    {
      "nombre": "Sofi",
      "apellido": "Pérez",
      "email": "sofi@ejemplo.com",
      "password": "1234",
      "rol": "admin",
      "nit": "87654321",
      "fechaRegistro": datetime.datetime.now(timezone.utc)
    }
]
# Usuarios aleatorios
for i in range(N_USUARIOS):
    usuarios.append({
        "nombre": random.choice(nombres),
        "apellido": random.choice(apellidos),
        "email": f"user{i}@ejemplo.com",
        "telefono": f"+34 {random.randint(600,799)}-{random.randint(100,999)}-{random.randint(100,999)}",
        "direccion": f"{random.randint(1,500)} {random.choice(calles)}, {random.choice(ciudades)}",
        "nit": str(random.randint(10_000_000,99_999_999)),
        "fechaRegistro": datetime.datetime.now(timezone.utc),
        "password": "HASHED_PASSWORD_PLACEHOLDER",
        "rol": random.choice(["admin","user"])
    })
res = db.usuarios.insert_many(usuarios)
user_ids = res.inserted_ids
print(f"{len(user_ids)} usuarios insertados.")

# —————————————————————————————————————————
# 3) CARGAR ARTÍCULOS DEL MENÚ YA EXISTENTES
articulos = list(db.articulos_menu.find({}, {"_id":1,"nombre":1,"precio":1}))
print(f"{len(articulos)} artículos del menú cargados.")

# —————————————————————————————————————————
# 4) GENERAR Y INSERTAR ÓRDENES
ordenes_docs = []
for _ in range(N_ORDENES):
    usr = random.choice(user_ids)
    rst = random.choice(resto_ids)
    muestra = random.sample(articulos, k=random.randint(1,5))
    items, total = [], 0
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
    ordenes_docs.append({
        "usuarioId": usr,
        "restauranteId": rst,
        "fecha": datetime.datetime.now(timezone.utc),
        "estado": random.choice(["confirmado","en preparación","entregado","cancelado"]),
        "total": round(total,2),
        "articulos": items
    })
res = db.ordenes.insert_many(ordenes_docs)
order_ids = res.inserted_ids
print(f"{len(order_ids)} órdenes insertadas.")

# —————————————————————————————————————————
# 5) GENERAR Y INSERTAR RESEÑAS
# Definir pesos para calificaciones alrededor de 4
ratings = [1, 2, 3, 4, 5]
weights = [5, 10, 20, 40, 25]  # promedio ~3.9

resenas = []
for _ in range(N_RESENAS):
    usr = random.choice(user_ids)
    # 80% referencian una orden; si es así, usan la misma restaurantId
    if random.random() < 0.8:
        ord_id = random.choice(order_ids)
        ord_doc = next((o for o in ordenes_docs if o.get('_id') == ord_id), None)
        rst = ord_doc["restauranteId"] if ord_doc else random.choice(resto_ids)
        doc = {
            "usuarioId": usr,
            "restauranteId": rst,
            "ordenId": ord_id,
            "calificacion": random.choices(ratings, weights)[0],
            "comentario": random.choice(comentarios),
            "fecha": datetime.datetime.now(timezone.utc)
        }
    else:
        rst = random.choice(resto_ids)
        doc = {
            "usuarioId": usr,
            "restauranteId": rst,
            "calificacion": random.choices(ratings, weights)[0],
            "comentario": random.choice(comentarios),
            "fecha": datetime.datetime.now(timezone.utc)
        }
    resenas.append(doc)

res = db.resenas.insert_many(resenas)
print(f"{len(res.inserted_ids)} reseñas insertadas.")

# —————————————————————————————————————————
print("✅ ¡Precarga completada!")
