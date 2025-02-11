import fs  from 'fs';
import chalk from 'chalk';

console.log(chalk.blue('Olá Mundo !!'));

function pegaArquivo(caminhoDoArquivo){
    fs.readFile(caminhoDoArquivo);

}