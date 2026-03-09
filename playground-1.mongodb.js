// Switch to FarmHub database
use("farmhub")

// Create collections
db.createCollection("farmers")
db.createCollection("equipment")
db.createCollection("orders")

// Insert sample data
db.farmers.insertOne({
    name: "Ravi Kumar",
    location: "Warangal",
    phone: "9876543210"
});

db.equipment.insertOne({
    name: "Tractor",
   type: "Heavy Machine",
   price: 500000
});

db.orders.insertOne({
    equipmentName: "Tractor",
    quantity: 1,
    customerName: "Suresh"
});

 //View data
db.farmers.find()
db.equipment.find()
db.orders.find()