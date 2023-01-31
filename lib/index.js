import qs from 'qs';

const identity = (_) => _;

const createAutoApi = ({
  baseUrl = '',
  headers = null,
  proxyTarget = {}, // internal
}) => new Proxy(proxyTarget, {
  get: (_, prop) => {
    const method = {
      get: 'GET',
      post: 'POST',
      put: 'PUT',
      patch: 'PATCH',
      delete: 'DELETE',
    }[prop];

    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method || 'POST');

    const requester = (async (params) => fetch([
      baseUrl,
      !method && `/${prop}`,
      params && !hasBody && `?${qs.stringify(params)}`,
    ].filter(identity).join(''), {
      method: method || 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      ...params && hasBody && {
        body: JSON.stringify(params),
      },
    }).then((content) => content.json()));

    return createAutoApi({
      baseUrl: `${baseUrl}/${prop}`,
      headers,
      proxyTarget: requester,
    });
  },
});

export default createAutoApi;
