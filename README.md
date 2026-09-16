# 💪 TrackFit

O TrackFit é uma aplicação web para acompanhamento de treinos de musculação.

A aplicação permite visualizar os treinos, registrar as cargas utilizadas, controlar as séries realizadas e utilizar um cronômetro para os períodos de descanso.

---

## 🛠️ Tecnologias

* **HTML5**
* **CSS3**
* **JavaScript**
* **JSON**
* **LocalStorage**
* **Service Worker**
* **Progressive Web App (PWA)**

---

## 📂 Estrutura

```text
trackfit/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── data/
│   │   └── treinos.json
│   ├── fonts/
│   └── icons/
│
├── index.html
├── manifest.json
└── service-worker.js
```

---

## 🚀 Como executar

Clone o repositório:

```text
git clone https://github.com/dfmarinho/trackfit.git
```

Acesse a pasta:

```text
cd trackfit
```

Execute utilizando um servidor HTTP local. Por exemplo:

```text
python -m http.server 8000
```

Acesse no navegador:

```text
http://localhost:8000
```

---

## 💾 Armazenamento

As cargas utilizadas nos exercícios são armazenadas no localStorage do navegador.

As configurações dos treinos são carregadas a partir do arquivo:

```text
assets/data/treinos.json
```