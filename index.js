import Genetic from './implementations/new.js';

document.getElementById('submit').addEventListener('click', async function () {
    const rows =  Array.from(document.getElementsByClassName('row'));
    rows.forEach(row => row.classList.add('hidden'));

    if (document.getElementById('chart').classList.contains('hidden')) {
        document.getElementById('loader').classList.remove('hidden');
        document.getElementById('submit').classList.add('hidden');
        await new Promise(r => setTimeout(r, 10));
    }

    const populationSize = Number(document.getElementById('input1').value);
    const chromosomeSize = Number(document.getElementById('input2').value);
    const mutationChance = Number(document.getElementById('input3').value);
    const crossoverChance = Number(document.getElementById('input4').value);
    const maxIterations = Number(document.getElementById('input5').value);

    const algo = new Genetic(populationSize, chromosomeSize, mutationChance, crossoverChance);
    while (algo.epochCount < maxIterations) { // Math.max(...algo.currentFitness) < algo.chromosomeSize &&
        algo.step();
        console.log("Generation:", algo.epochCount, "Fittest:" , algo.fittest);
    }

    document.getElementById('loader').classList.add('hidden');
    document.getElementById('chart').classList.remove('hidden');
    document.getElementById('submit').classList.remove('hidden');
    if (Chart.getChart("chart")) Chart.getChart("chart").destroy();
    const ctx = document.getElementById('chart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: algo.meanFitness.map((_, i) => i),
            datasets: [
                {
                    label: 'Mean fitness',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: algo.meanFitness,
                },
                {
                    label: 'Max fitness',
                    backgroundColor: 'rgb(0, 99, 132)',
                    borderColor: 'rgb(0, 99, 132)',
                    data: algo.maxFitness,
                }
            ]
          },
        options: {}
    });
});