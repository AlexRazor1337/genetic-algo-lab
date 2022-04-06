class Individual {
    constructor(chromosomeSize) {
        this.chromosome = new Array(chromosomeSize).fill();
        this.chromosome = this.chromosome.map(() => Math.round(Math.random()));
    }

    getFitnes() {
        this.fitness = this.chromosome.reduce((acc, cur) => acc + cur, 0)
        return this.fitness;
    }
}

class Genetic {
    constructor(populationSize, eliteSize, chromosomeSize) {
        this.populationSize = populationSize;
        this.chromosomeSize = chromosomeSize;
        this.eliteSize = eliteSize;

        this.epochCount = 0;

        this.mutationProb = 0.01; // TODO pass as parameter
        this.crossoverProb = 0.4;
        this.selectionFactor = 0.9;

        this.population = new Array(this.populationSize).fill();
        this.population = this.population.map(() => new Individual(chromosomeSize));

        this.elite = new Array(this.eliteSize).fill();
        this.elite = this.elite.map(() => new Individual(chromosomeSize));

        this.meanFitness = [];
        this.maxFitness = [];
        this.currentFitness = [];
    }

    selection() {
        const newPopulation = [];

        for (let i = 0; i < this.eliteSize; i++) {
            this.population[i] = this.elite[i];
        }

        this.currentFitness = this.population.map(individual => individual.getFitnes());
        const minFitness = Math.min(...this.currentFitness);
        const maxFitness = Math.max(...this.currentFitness);
        const bestIndividual = this.population.find(individual => individual.fitness == maxFitness);
        console.log('Best individual: ', bestIndividual);

        if (maxFitness !== minFitness) {
            let N = 0;
            while (N < this.populationSize) {
                const num = Math.floor(Math.random() * this.population.length);
                if (this.selectionFactor * Math.random() < (this.currentFitness[num] - minFitness) / (maxFitness - minFitness)) {
                    newPopulation.push(this.population[num]);
                    N++;
                }
            }

            this.population.sort((a, b) => b.getFitnes() - a.getFitnes());

            for (let i = 0; i < this.eliteSize; i++) {
                this.elite[i] = this.population[i];
            }

            for (let i = 0; i < this.population.length; i++) {
                this.population[i] = newPopulation[i];
            }
        }
    }

    crossover() {
        for (let i = 0; i < this.population.length; i++) {
            if (Math.random() < this.crossoverProb) {
                const j = Math.floor(Math.random() * this.population.length);
                if (i != j) {
                    const pos = Math.floor(Math.random() * (this.chromosomeSize));
                    for (let k = 0; k < pos; k++) {
                        const temp = this.population[i].chromosome[k];
                        this.population[i].chromosome[k] = this.population[j].chromosome[k];
                        this.population[j].chromosome[k] = temp;
                    }
                }
            }
        }
    }

    mutation() {
        for (let i = 0; i < this.population.length; i++) {
            for (let j = 0; j < this.chromosomeSize; j++) {
                if (Math.random() < this.mutationProb) {
                    this.population[i].chromosome[j] = 1 - this.population[i].chromosome[j];
                }
            }
        }
    }

    step() {
        this.epochCount += 1;

        this.mutation();
        this.crossover();
        this.selection();

        this.currentFitness = this.population.map(individual => individual.getFitnes());
        this.meanFitness.push(this.currentFitness.reduce((acc, cur) => acc + cur, 0) / this.population.length);
        this.maxFitness.push(Math.max(...this.currentFitness));
    }
}


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