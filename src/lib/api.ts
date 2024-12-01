import type { AxiosError, AxiosRequestConfig, Method } from 'axios'
import axios from 'axios'
import qs from 'qs'


const handleErrors = (error: AxiosError | any) => {
  
  let errorObject = {}
  if (error.response && error.response.data) {
    return Promise.reject({
      error: error.response.data.error,
      message: error.response.data.message,
      status: error.response.status,
    })
  } 
  else if (error.code === "ERR_BAD_RESPONSE") {
    return Promise.reject({
      error: "Unable to process this request, please try again later",
      message: error.code,
    });
  }
  errorObject = {
    message: 'Network Error. Please check your connection and try again!',
  }
  return Promise.reject(errorObject)
}

export default class API {
  

  static setBaseURL(url: string) {
    if (url) {
      axios.defaults.baseURL = url
    }
  }

  static setHeader(headers: any = {}): any {
    axios.defaults.headers.common = {
      ...axios.defaults.headers.common,
      ...headers,
    }
    return {
      ...axios.defaults.headers.common,
      ...headers,
    }
  }

  static headers(contentType: string = 'application/json'): any {
    return {
      ...axios.defaults.headers.common,
      Accept: 'application/json',
      'Content-Type': contentType,
    }
  }

  static get(
    route: string,
    params: any = {},
    headers: any = {},
    otherOptions: any = {}
  ): Promise<any> {
    return this.xhr(route, params, 'GET', undefined, headers, otherOptions)
  }

  static put(route: string, params: any = {}): Promise<any> {
    return this.xhr(route, params, 'PUT')
  }

  static post(route: string, params: any = {}): Promise<any> {
    return this.xhr(route, params, 'POST')
  }

  static postWithForm(route: string, params: any = {}): Promise<any> {
    return this.xhr(
      route,
      qs.stringify(params),
      'POST',
      'application/x-www-form-urlencoded'
    )
  }

  static postWithFiles(route: string, params: any = {}): Promise<any> {
    return this.xhr(route, params, 'POST', 'multipart/form-data')
  }

  static putWithFiles(route: string, params: any = {}): Promise<any> {
    return this.xhr(route, params, 'PUT', 'multipart/form-data')
  }

  static delete(route: string, params: any = {}): Promise<any> {
    return this.xhr(route, params, 'DELETE')
  }

  static patch(route: string, params: any): Promise<any> {
    return this.xhr(route, params, 'PATCH')
  }

  static xhr(
    route: string,
    params: any,
    verb: Method,
    contentType: string = 'application/json',
    headers: any = {},
    otherOptions: any = {}
  ) {
    const dataOption: AxiosRequestConfig = {}
    if (params && verb === 'GET') {
      dataOption.params = params
    } else {
      dataOption.data = params
    }
    const options = { method: verb, url: route, ...dataOption, ...otherOptions }
    options.headers = Object.assign(API.headers(contentType), headers)
    return axios(options)
      .then((responseJson) => responseJson.data)
      .catch(handleErrors)
  }
}
