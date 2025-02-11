import chalk from "chalk";

function extraiLinks (arrLinks) {
  return arrLinks.map((objetoLink) => Object.values(objetoLink).join())
}


const cache = new Map();

async function checaStatus(listaURLs) {
  const arrStatus = await Promise.all(
    listaURLs.map(async (url) => {
      if (cache.has(url)) {
        console.log('já existe no cache para: ${url}');
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

  return arrStatus;
}


async function checaStatus_antigo (listaURLs) {
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

  return listaDeLinks.map((objeto, indice) => ({
    ...objeto,
    status: status[indice]
  }))
}
