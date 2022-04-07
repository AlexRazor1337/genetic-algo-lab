// import Genetic from './algorithm.js';
import Genetic from './alternative.js';

window.onload = function () {
    const algo = new Genetic(100, 5, 20);
    while (Math.max(...algo.currentFitness) < algo.chromosomeSize && algo.epochCount < 50) {
        algo.step();
    }
    console.log(algo);

    const ctx = document.getElementById('myChart').getContext('2d');
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
}