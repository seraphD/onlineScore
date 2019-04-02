export default ({
  url,
  method,
  data,
  params,
  paramsSerializer,
  wholeResp = false,
  sucCallback,
  errCallback,
  showErrMsg = true,
  showSucMsg = false,
  defaultValue,
  debug = false,
  responseType = 'json'
}: IParams) =>
  new Promise<{ success: boolean; data: any }>((resolve, reject) => {
    const csrfToken = ((window as any).SERVER_DATA || {}).csrfToken;
    axios({
      url,
      method,
      params,
      paramsSerializer,
      data,
      responseType,
      headers: {
        'csrf-token': csrfToken,
        'x-forword-referer': 'web'
      }
    })
      .then((resp: any) => {
        if (!resp) {
          showErrMsg && showWarn('请求地址不存在 ⊙﹏⊙ !');
          return;
        }
        if (
          resp.status &&
          resp.status === 200 &&
          resp.data &&
          (resp.data.status && +resp.data.status !== 0)
        ) {
          debug && console.info(`%c ${method} ${url} failed!`, failure);
          showErrMsg && showWarn(resp.data.message);
          errCallback && errCallback(resp.data);
          resolve({
            success: false,
            data: defaultValue
          });
        } else {
          debug && console.info(`%c ${method} ${url} successful!`, success);
          showSucMsg && showSuc();
          sucCallback &&
            sucCallback(
              wholeResp ? resp.data : resp.data ? resp.data.data : null
            );
          resolve({
            success: true,
            data: wholeResp ? resp.data : resp.data ? resp.data.data : null
          });
        }
        debug && console.info(`${method} ${url} response`, resp.data);
      })
      .catch(err => {
        debug && console.info(`%c ${method} ${url} failed!`, failure);
        debug && console.info(`${method} ${url} response`, err);
        if (err) {
          if (err.status === 504 || err.status === 404 || err.status === 405) {
            showErrMsg && showWarn('请求地址不存在 ⊙﹏⊙ !');
          } else if (err.status === 403) {
            showErrMsg && showWarn('权限不足,请联系管理员！');
          } else if (err.status === 401) {
            showErrMsg && showWarn('登陆过期啦！');
          } else {
            showErrMsg && showWarn('服务器出现未知错误!');
          }
        } else {
          showErrMsg && showWarn('服务器出现未知错误!');
        }
        errCallback && errCallback(err);
        resolve({
          success: false,
          data: defaultValue
        });
      });
  });