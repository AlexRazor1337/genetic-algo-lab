class Individual {
    constructor(chromosomeSize) {
        this.fitness = 0;
        this.chromosomeSize = chromosomeSize;

        this.chromosome = new Array(this.chromosomeSize).fill();
        this.chromosome = this.chromosome.map(() => Math.round(Math.random()));
    }

    getFitness() {
        this.fitness = this.chromosome.reduce((acc, cur) => acc + cur, 0);

        return this.fitness;
    }
}

export default class Genetic {
    constructor(populationSize, chromosomeSize, mutationChance) {
        this.chromosomeSize = chromosomeSize;
        this.populationSize = populationSize;
        this.mutationChance = mutationChance;
        this.population = new Population(populationSize, chromosomeSize);
        this.fittest; // Individual
        this.secondFittest; // Individual
        this.epochCount = 0;

        this.meanFitness = [];
        this.maxFitness = [];
        this.currentFitness = []
    }

    selection() {
        //Select the most fittest individual
        this.fittest = this.population.getFittest();

        //Select the second most fittest individual
        this.secondFittest = this.population.getSecondFittest();
    }

    crossover() {
        for (let i = 0; i < this.population.length; i++) {
            if (Math.random() < 0.4) {
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
        for (let i = 0; i < this.populationSize; i++) {
            let chance = this.mutationChance;

            if (this.population.population[i].fitness >= this.secondFittest.fitness) {
                chance **= 2;
            }

            if (Math.random() < chance) {
                for (let j = 0; j < this.chromosomeSize; j++) {
                    if (Math.random() < chance) {
                        this.population.population[i].chromosome[j] = 1 - this.population.population[i].chromosome[j];
                    }
                }
            }
        }
    }

    getFittestOffspring() {
        if (this.fittest.fitness > this.secondFittest.fitness) {
            return this.fittest;
        }
        return this.secondFittest;
    }

    // Replace least fittest individual from most fittest offspring
    addFittestOffspring() {

        //Update fitness values of offspring
        this.fittest.getFitness();
        this.secondFittest.getFitness();

        //Get index of least fit individual
        let leastFittestIndex = this.population.getLeastFittestIndex();

        //Replace least fittest individual from most fittest offspring
        this.population.population[leastFittestIndex] = this.getFittestOffspring();
    }

    step() {
        this.epochCount += 1;

        this.selection();
        this.crossover();
        this.mutation();

        this.addFittestOffspring();

        this.population.calculateFitness();

        console.log("Generation: " + this.epochCount + " Fittest: " + this.population.fittest);

        this.currentFitness = this.population.population.map(individual => individual.getFitness());
        this.meanFitness.push(this.currentFitness.reduce((acc, cur) => acc + cur, 0) / this.population.population.length);
        this.maxFitness.push(Math.max(...this.currentFitness));
    }
}


class Population {
    constructor(populationSize, chromosomeSize) {
        this.populationSize = populationSize;
        this.population = new Array(this.populationSize).fill();
        this.population = this.population.map(() => new Individual(chromosomeSize));
        this.fittest = 0; // int, fitness of fittest individual
    }

    getFittest() {
        let maxFit = Number.MIN_SAFE_INTEGER;
        let maxFitIndex = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (maxFit <= this.population[i].fitness) {
                maxFit = this.population[i].fitness;
                maxFitIndex = i;
            }
        }

        this.fittest = this.population[maxFitIndex].fitness;
        return this.population[maxFitIndex];
    }

    getSecondFittest() {
        let maxFit1 = 0;
        let maxFit2 = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].fitness > this.population[maxFit1].fitness) {
                maxFit2 = maxFit1;
                maxFit1 = i;
            } else if (this.population[i].fitness > this.population[maxFit2].fitness) {
                maxFit2 = i;
            }
        }

        return this.population[maxFit2];
    }

    // Get index of least fittest individual
    getLeastFittestIndex() { // int
        let minFitVal = Number.MAX_SAFE_INTEGER;
        let minFitIndex = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (minFitVal >= this.population[i].fitness) {
                minFitVal = this.population[i].fitness;
                minFitIndex = i;
            }
        }
        return minFitIndex;
    }

    // Calculate fitness of each individual
    calculateFitness() {
        for (let i = 0; i < this.population.length; i++) {
            this.population[i].getFitness();
        }

        this.getFittest();
    }
}
