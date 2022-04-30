import Genetic from './implementations/new.js';

const createP = (text) => {
    const p = document.createElement('p');
    p.innerText = text;
    return p;
}

document.getElementById('submit').addEventListener('click', async function () {
    document.getElementById('params').classList.add('hidden');

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
    const stopAtBestPossible = document.getElementById('input6').checked;
    const targetX = Number(document.getElementById('input7').value);
    const targetY = Number(document.getElementById('input8').value);

    const algo = new Genetic(populationSize, chromosomeSize, mutationChance, crossoverChance, targetX, targetY);
    while (algo.epochCount < maxIterations && ((stopAtBestPossible && algo.bestFitness[algo.bestFitness.length - 1] != 0) || !stopAtBestPossible)) {
        algo.step();
        // console.log("Generation:", algo.epochCount, "Fittest:" , algo.fittest);
    }

    document.getElementById('loader').classList.add('hidden');
    document.getElementById('chart').classList.remove('hidden');
    document.getElementById('chart2').classList.remove('hidden');
    document.getElementById('submit').classList.remove('hidden');
    if (Chart.getChart("chart")) {
        Chart.getChart("chart").destroy();
        Chart.getChart("chart2").destroy();
    }
    const ctx = document.getElementById('chart').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');

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
                    label: 'Best fitness',
                    backgroundColor: 'rgb(0, 99, 132)',
                    borderColor: 'rgb(0, 99, 132)',
                    data: algo.bestFitness,
                }
            ]
          },
        options: {}
    });

    algo.bestIndividuals.sort((a, b) => a.fitness - b.fitness);
    const bestIndividual = algo.bestIndividuals[0];
    document.getElementById('stats').innerHTML = '';
    [
        createP('Target X: ' + targetX),
        createP('Target Y: ' + targetY),
        createP('Best individual genes:'),
        createP(bestIndividual.chromosome.join(' ')),
        createP('Best individual X: ' + parseInt(bestIndividual.chromosome.slice(0, bestIndividual.chromosome.length / 2).join(''), 2)),
        createP('Best individual Y: ' + parseInt(bestIndividual.chromosome.slice(bestIndividual.chromosome.length / 2).join(''), 2)),
        createP(`Fitness: ${bestIndividual.fitness}`)
    ].forEach(p => document.getElementById('stats').appendChild(p));

    new Chart(ctx2, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Points',
                    data: algo.points
                },
                {
                    label: 'Best individual',
                    backgroundColor: 'rgb(255, 0, 0)',
                    data: [{x: parseInt(bestIndividual.chromosome.slice(0, bestIndividual.chromosome.length / 2).join(''), 2), y: parseInt(bestIndividual.chromosome.slice(bestIndividual.chromosome.length / 2).join(''), 2)}]
                }
            ]
          },
        options: {}
    });
});