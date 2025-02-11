import chalk from "chalk";

function extraiLinks (arrLinks) {
  return arrLinks.map((objetoLink) => Object.values(objetoLink).join())
}

/*async function checaStatus (listaURLs) {
  const arrStatus = await Promise
  .all(
    listaURLs.map(async (url) => {
      try {
        const response = await fetch(url)
        return response.status;
      } catch (erro) {
        return manejaErros(erro);
      }
    })
  )
  return arrStatus;
}*/

const cache = new Map();

async function checaStatus(listaURLs) {
  const statusArray = await Promise.all(
    listaURLs.map(async (url) => {
      if (cache.has(url)) {
        console.log('Achei no cache:'+ url);
        return cache.get(url);
      }

      try {
        const response = await fetch(url);
        cache.set(url, response.status); 
        return response.status;
      } catch (erro) {
        const status = manejaErros(erro);
        cache.set(url, status); 
        return status;
      }
    })
  );

  return statusArray;
}


function manejaErros (erro) {
  if (erro.cause.code === 'ENOTFOUND') {
    return 'link não encontrado';
  }else if (erro.cause.code === 'ECONNREFUSED') {
    return 'conexão ao servidor falhou';
  }else if (erro.cause.code === 'ETIMEDOUT') {
    return 'requisição demorou muito para responder';
  }
   else {

    return 'ocorreu algum erro';
  }
}

export default async function listaValidada (listaDeLinks) {
  const links = extraiLinks(listaDeLinks);
  const status = await checaStatus(links);
  //status = await checaStatus(links);

  return listaDeLinks.map((objeto, indice) => ({
    ...objeto,
    status: status[indice]
  }))
}
