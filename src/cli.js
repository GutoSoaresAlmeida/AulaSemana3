import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from './index.js';
import listaValidada from './http-validacao.js';

const caminho = process.argv;

async function imprimeLista(valida, resultado, identificador = '', json = false) {
  if (json) {
    // Formata a saída como JSON
    const output = {
      identificador: identificador || 'arquivo',
      links: resultado.links,
      total: resultado.total,
    };

    if (valida) {
      output.links = await listaValidada(resultado.links);
    }

    console.log(JSON.stringify(output, null, 2));
    return;
  }

  // Formato tradicional
  if (valida) {
    console.log(
      chalk.yellow('Lista validada'),
      chalk.black.bgGreen(identificador),
      await listaValidada(resultado.links),
      chalk.black.bgGreen(resultado.total)
    );
  } else {
    console.log(
      chalk.yellow('Lista de links'),
      chalk.black.bgGreen(identificador),
      resultado.links,
      chalk.black.bgGreen(resultado.total)
    );
  }
}

async function processaTexto(argumentos) {
  const caminho = argumentos[2];
  const valida = argumentos.includes('--valida');
  const json = argumentos.includes('--json');

  try {
    fs.lstatSync(caminho);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      console.log('Arquivo ou diretório não existe');
      return;
    }
  }

  if (fs.lstatSync(caminho).isFile()) {
    const resultado = await pegaArquivo(argumentos[2]);
    imprimeLista(valida, resultado, '', json);
  } else if (fs.lstatSync(caminho).isDirectory()) {
    const arquivos = await fs.promises.readdir(caminho);
    arquivos.forEach(async (nomeDeArquivo) => {
      const lista = await pegaArquivo(`${caminho}/${nomeDeArquivo}`);
      imprimeLista(valida, lista, nomeDeArquivo, json);
    });
  }
}

processaTexto(caminho);
