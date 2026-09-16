let treinos = {};
let faixas = {};
let currentTab = 'A';
let timerInterval;

async function loadTreinos() {
    const res = await fetch('assets/data/treinos.json');
    const data = await res.json();

    faixas = data.faixas;
    treinos = { A: data.A, B: data.B, C: data.C, D: data.D };

    console.log('faixas carregadas:', faixas);
    console.log('treino A ex[0]:', treinos.A.exercicios[0]);

    renderExercicios();
}

function buildWeightField(ex, savedValue) {
    if (!ex.faixa) {
        return `<input type="text" placeholder="--" disabled class="weight-input weight-input--disabled">`;
    }

    const { min, max, step } = faixas[ex.faixa];
    const saved = parseFloat(savedValue);
    let options = '<option value="">--</option>';

    for (let v = min; v <= max; v = Math.round((v + step) * 10) / 10) {
        const selected = v === saved ? 'selected' : '';
        options += `<option value="${v}" ${selected}>${v} kg</option>`;
    }

    return `<select class="weight-input" onchange="saveWeight('${ex.nome}', this.value)">${options}</select>`;
}

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab'));
    document.getElementById(`tab${tab}`).classList.add('active-tab');
    renderExercicios();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startTimer(seconds) {
    clearInterval(timerInterval);
    let timeLeft = seconds;
    const display = document.getElementById('timerDisplay');
    const secondsText = document.getElementById('seconds');

    display.classList.remove('fade-out');
    display.classList.add('active', 'timer-running');
    secondsText.innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft >= 0) {
            secondsText.innerText = timeLeft;
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            
            display.classList.remove('timer-running');
            display.classList.add('fade-out');

            setTimeout(() => {
                display.classList.remove('active');
                secondsText.innerText = "0";
            }, 500);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    const display = document.getElementById('timerDisplay');
    
    display.classList.add('fade-out');
    
    setTimeout(() => {
        display.classList.remove('active', 'timer-running');
    }, 500);
}

function getStorageKey(exercicioNome) {
    return `carga_${currentTab}_${exercicioNome.replace(/\s+/g, '_').toLowerCase()}`;
}

function saveWeight(exercicioNome, value) {
    localStorage.setItem(getStorageKey(exercicioNome), value);
}

function renderExercicios() {
    const container = document.getElementById('exerciseList');
    container.innerHTML = `<h2 class="exercise-list-title">${treinos[currentTab].nome}</h2>`;

    treinos[currentTab].exercicios.forEach((ex) => {
        const card = document.createElement('div');
        card.className = `card ${ex.core ? 'card--core' : 'card--main'}`;

        const savedWeight = localStorage.getItem(getStorageKey(ex.nome)) || '';

        card.innerHTML = `
            <div class="card-header">
                <div class="card-info">
                    <h3>${ex.nome}</h3>
                    <p>${ex.series} SÉRIES • ${ex.reps} REPS</p>
                </div>
                <button onclick="startTimer(${ex.descanso})" class="btn-rest">
                    REST
                </button>
            </div>
            <div class="card-body">
                <div class="weight-field">
                    <label>Peso (kg)</label>
                    ${buildWeightField(ex, savedWeight)}
                </div>
                <div class="series-field">
                    <label>Séries</label>
                    <div class="series-counter-wrap">
                        <button onclick="updateSeries(this, -1)" class="btn-series">-</button>
                        <span class="series-counter">0</span>
                        <button onclick="updateSeries(this, 1, ${ex.series})" class="btn-series">+</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateSeries(btn, delta, max) {
    const span = delta === 1 ? btn.previousElementSibling : btn.nextElementSibling;
    let val = parseInt(span.innerText);
    val = Math.max(0, val + delta);
    if (max) val = Math.min(max, val);
    span.innerText = val;

    const card = btn.closest('.card');
    if (max && val === max) {
        span.classList.add('brand-text-green');
        card.classList.add('card--done');
    } else {
        span.classList.remove('brand-text-green');
        card.classList.remove('card--done');
    }
}

function confirmFinish() {
    document.getElementById('confirmModal').classList.add('active');
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

function resetAll() {
    document.querySelectorAll('.series-counter').forEach(span => {
        span.innerText = '0';
        span.classList.remove('brand-text-green');
        span.closest('.card').classList.remove('card--done');
    });
    closeModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', loadTreinos);