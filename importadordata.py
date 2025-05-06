#!/usr/bin/env python3
# seed_mongo.py
#
# ─────────────────────────────────────────────────────────────────────
#   Precarga masiva:
#     •  5 restaurantes con GeoJSON Point
#     • 10 000 usuarios
#     • 50 000 órdenes (repartidas en los últimos 12 meses)
#     • 50 000 reseñas
# ─────────────────────────────────────────────────────────────────────

import random
from datetime import datetime, timedelta, timezone

from pymongo import MongoClient

# ───────────────────────────────── CONFIGURA TU URI ─────────────────────────────
MONGO_URI = (
    "mongodb+srv://garciasalasperezjulio:1234@lab1.ka8t9.mongodb.net/"
    "Restaurante?retryWrites=true&w=majority"
)
client = MongoClient(MONGO_URI)
db = client.get_database()

# ───────────────────────────────── PARÁMETROS ───────────────────────────────────
N_USUARIOS = 10_000
N_ORDENES  = 50_000           # ← 50 k
N_RESENAS  = 50_000

# ───────────────────────────────── DATOS DE EJEMPLO ────────────────────────────
calles    = ["Av. Principal", "Calle Secundaria", "Paseo de la Reforma", "Camino Real"]
ciudades  = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"]
nombres   = ["María", "Juan", "Ana", "Luis", "Carmen", "Carlos", "Lucía", "Miguel"]
apellidos = ["García", "Rodríguez", "Martínez", "López", "Sánchez", "Pérez"]

plantillas_platillo = [
    "{} estuvieron increíbles!",
    "Los {} me encantaron, repetiré seguro.",
    "La porción de {} estuvo perfecta y deliciosa.",
    "{} llegaron un poco fríos, pero el sabor lo compensa.",
    "Muy buena presentación de los {}."
]
plantillas_pedido = [
    "El pedido completo fue perfecto, ¡gracias!",
    "Muy buena experiencia con todo el pedido.",
    "Tardó un poco, pero todo llegó excelente.",
    "La atención y el pedido en general estuvieron de 10.",
    "Repetiré mi pedido completo sin duda."
]

now   = datetime.now(timezone.utc)
start = now - timedelta(days=365)          # 1 año atrás

def rand_date():
    """Fecha aleatoria entre start y now (aware UTC)."""
    delta = now - start
    return start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))

# ───────────────────────────────── 1) RESTAURANTES ─────────────────────────────
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
        "ubicacion": {                                # GeoJSON Point ✔️
            "type": "Point",
            "coordinates": [
                round(random.uniform(-180, 180), 6),  # lng
                round(random.uniform(-90,  90), 6)    # lat
            ]
        },
        "telefono": f"+34 {random.randint(600,799)}-{random.randint(100,999)}-{random.randint(100,999)}",
        "email": f"info@{nombre.lower().replace(' ', '')}.com",
        "horario": [
            {"dia":"Lunes",     "apertura":"10:00", "cierre":"22:00"},
            {"dia":"Martes",    "apertura":"10:00", "cierre":"22:00"},
            {"dia":"Miércoles", "apertura":"10:00", "cierre":"22:00"},
            {"dia":"Jueves",    "apertura":"10:00", "cierre":"22:00"},
            {"dia":"Viernes",   "apertura":"10:00", "cierre":"23:00"},
            {"dia":"Sábado",    "apertura":"11:00", "cierre":"23:00"},
            {"dia":"Domingo",   "apertura":"12:00", "cierre":"21:00"}
        ]
    }
    resto_ids.append(db.restaurantes.insert_one(doc).inserted_id)
print(f"{len(resto_ids)} restaurantes insertados.")

# ───────────────────────────────── 2) USUARIOS ─────────────────────────────────
usuarios = [
    {
      "nombre": "Julio",
      "apellido": "García",
      "email": "julio@ejemplo.com",
      "password": "1234",
      "rol": "admin",
      "nit": "12345678",
      "fechaRegistro": now
    },
    {
      "nombre": "Sofi",
      "apellido": "Pérez",
      "email": "sofi@ejemplo.com",
      "password": "1234",
      "rol": "admin",
      "nit": "87654321",
      "fechaRegistro": now
    }
]
for i in range(N_USUARIOS):
    usuarios.append({
        "nombre": random.choice(nombres),
        "apellido": random.choice(apellidos),
        "email": f"user{i}@ejemplo.com",
        "telefono": f"+34 {random.randint(600,799)}-{random.randint(100,999)}-{random.randint(100,999)}",
        "direccion": f"{random.randint(1,500)} {random.choice(calles)}, {random.choice(ciudades)}",
        "nit": str(random.randint(10_000_000, 99_999_999)),
        "fechaRegistro": rand_date(),
        "password": "HASHED_PASSWORD_PLACEHOLDER",
        "rol": random.choice(["admin", "user"])
    })
user_ids = db.usuarios.insert_many(usuarios).inserted_ids
print(f"{len(user_ids)} usuarios insertados.")

# ───────────────────────────────── 3) ARTÍCULOS MENÚ ───────────────────────────
articulos = list(db.articulos_menu.find({}, {"_id":1,"nombre":1,"precio":1}))
print(f"{len(articulos)} artículos del menú cargados.")

# ───────────────────────────────── 4) ÓRDENES (50 k) ───────────────────────────
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
        "fecha": rand_date(),                           # ← distribuido 12 meses
        "estado": random.choice(["confirmado","en preparación","entregado","cancelado"]),
        "total": round(total, 2),
        "articulos": items
    })

# insertMany en lotes de 5 000 para no agotar RAM
batch = 5000
order_ids = []
for i in range(0, len(ordenes_docs), batch):
    part = ordenes_docs[i:i+batch]
    order_ids.extend(db.ordenes.insert_many(part).inserted_ids)
print(f"{len(order_ids)} órdenes insertadas.")

order_map = list(zip(order_ids, ordenes_docs))   # para reseñas

# ───────────────────────────────── 5) RESEÑAS ──────────────────────────────────
ratings  = [1, 2, 3, 4, 5]
weights  = [5,10,20,40,25]   # promedio 3.9 aprox.

resenas  = []
for _ in range(N_RESENAS):
    usr                = random.choice(user_ids)
    ord_id, ord_doc    = random.choice(order_map)
    rst                = ord_doc["restauranteId"]

    if random.random() < 0.2:                       # 20 % reseña de plato
        art           = random.choice(ord_doc["articulos"])
        menu_item_id  = art["menuItemId"]
        comentario    = random.choice(plantillas_platillo).format(art["nombre"])
    else:                                           # 80 % reseña del pedido
        menu_item_id  = None
        comentario    = random.choice(plantillas_pedido)

    resenas.append({
        "usuarioId": usr,
        "restauranteId": rst,
        "ordenId": ord_id,
        "menuItemId": menu_item_id,
        "calificacion": random.choices(ratings, weights)[0],
        "comentario": comentario,
        "fecha": rand_date()
    })

# insertMany en lotes de 10 000
batch = 10_000
for i in range(0, len(resenas), batch):
    db.resenas.insert_many(resenas[i:i+batch])
print(f"{len(resenas)} reseñas insertadas.")

# ───────────────────────────────── FIN ─────────────────────────────────────────
print("✅ ¡Precarga completada!")
