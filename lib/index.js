const qs = require('qs');

const identity = (_) => _;

const createAutoFetch = ({
  baseUrl = '',
  headers = null,
  proxyTarget = {}, // internal
  // postProcess = (content) => content.json(),
  postProcess = null,
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

    const requester = async (params) => {
      const content = await fetch([
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
      });

      if (postProcess) {
        return postProcess(content);
      }

      return content;
    };

    return createAutoFetch({
      baseUrl: `${baseUrl}/${prop}`,
      headers,
      proxyTarget: requester,
    });
  },
});

module.exports = createAutoFetch;
