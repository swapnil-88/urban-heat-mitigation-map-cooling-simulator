# Vadodara Urban Heat Island (UHI) Mitigation & Microclimate Simulator

**Municipal Microclimate Decision Support System**  
*Government of Gujarat — Vadodara Municipal Corporation (VMC)*

---

## 🏛️ Project Overview
This application is an interactive GIS-based thermodynamic simulator engineered to evaluate and model Urban Heat Island (UHI) mitigation across Vadodara's urban sectors. It calculates the microclimate cooling yield of native urban tree plantations based on empirical aerodynamic and evapotranspiration equations.

---

## 🚀 Quick Start (Running in VS Code)

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- VS Code or any modern code editor

### Installation & Launch
```bash
# 1. Open the project folder in terminal / VS Code

# 2. Install dependencies
npm install

# 3. Launch the development server
npm run dev

# 4. Open in your browser:
# http://localhost:3000
```

> **Note:** The project runs **100% independently and self-contained**. It requires no external API keys or cloud configurations to run locally.

---

## 🔬 Core Scientific & Thermodynamic Equations

The engine models temperature reductions using established environmental biophysics equations:

1. **Ambient Air Temperature Reduction ($\Delta T_{air}$)**:
   $$\Delta T_{air} = \frac{N_{trees} \times A_{crown} \times \text{LAI} \times E_{transpiration}}{A_{zone}}$$
   - $N_{trees}$: Volume of trees planted
   - $A_{crown}$: Individual species crown area ($m^2$)
   - $\text{LAI}$: Leaf Area Index ($m^2$ leaf area per $m^2$ ground)
   - $E_{transpiration}$: Volumetric transpiration cooling coefficient
   - $A_{zone}$: Total land area of the municipal ward ($m^2$)

2. **Surface Radiant Heat Drop ($\Delta T_{surface}$)**:
   $$\Delta T_{surface} = \Delta T_{air} \times 2.85$$
   - Models the direct interception of solar radiation by dense leaf canopy over asphalt and concrete.

3. **10-Year Growth Stage Trajectory**:
   - **Years 0–2 (Sapling)**: ~20% canopy development
   - **Years 3–5 (Juvenile)**: ~60% canopy spread
   - **Years 6–8 (Maturing)**: ~85% canopy interlocking
   - **Years 9–10 (Full Mature)**: 100% biological cooling capacity

---

## 🌳 Native Gujarat Botanical Species Catalog
- **Neem (*Azadirachta indica*)**: High pollution tolerance, drought hardy; preferred for industrial zones (Makarpura GIDC).
- **Banyan / Vad (*Ficus benghalensis*)**: Vadodara's namesake keystone tree; massive $120\text{ m}^2$ crown offering maximum shade.
- **Bakul (*Mimusops elengi*)**: Dense evergreen foliage; ideal for narrow historic street canyons (Mandvi Heritage Core).
- **Amaltas (*Cassia fistula*)**: Golden blooms; suited for commercial avenues and pedestrian walkways (Alkapuri).
- **Karanj (*Pongamia pinnata*)**: Salt/drought hardy, nitrogen-fixing canopy for road buffers.
- **Peepal (*Ficus religiosa*)**: Round-the-clock oxygenation with deep canopy cooling for high-rise residential parks (Gotri-Vasna).
- **Jamun (*Syzygium cumini*)**: Broadleaf shade and fruit tree for transit gateways (Waghodia Road).

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
- **GIS Cartography**: Leaflet, React-Leaflet (WGS84 / EPSG:4326 Datum)
- **Data Visualization**: Recharts (Dual-axis 10-year thermal cooling projection)
- **Document Export**: jsPDF (Generates official vector PDF municipal assessment documents)
- **Backend / Dev Server**: Express & TSX with embedded Vite middleware
