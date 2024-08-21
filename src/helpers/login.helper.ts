/* eslint-disable no-empty */
/* eslint-disable no-param-reassign */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-underscore-dangle */


const toParams = (query: string) => {
  const q = query.replace(/^\??\//, '')
  return q.split('&').reduce((values: any, param: any) => {
    const [key, value] = param.split('=')
    if (key) values[key] = value
    return values
  }, {})
}

class PopupWindow {
  id: string | undefined

  url: string | undefined

  options: any

  window: Window | null

  promise: Promise<any>

  constructor(
    params: any,
    options = { height: 1000, width: 600 },
    id = '_blank'
  ) {
    this.id = id
    this.url = params.url
    this.options = options
    this.window = null
    this.promise = Promise.resolve()
  }

  open() {
    const { url } = this
    this.window = window.open(url, '_blank')
  }

  close() {
    this.cancel()
    if (this.window) this.window.close()
  }

  poll() {
    this.promise = new Promise((resolve, reject) => {
      this.id = window
        .setInterval(() => {
          try {
            const popup = this.window
            if (!popup || popup.closed !== false) {
              this.close()
              reject(new Error('The popup was closed'))
              return
            }
            if (
              this.url &&
              (popup.location.href === this.url ||
                popup.location.pathname === 'blank' ||
                popup.location.href.includes(this.url))
            ) {
              return
            }
            const params = toParams(popup.location.search.replace(/^\?/, ''))
            resolve(params)
            // this.close()
          } catch (error) {
            console.error('Polling Error', error)
          }
        }, 500)
        .toString()
    })
  }

  cancel() {
    if (this.id) {
      window.clearInterval(this.id)
      this.id = undefined
    }
  }

  then(...args: any) {
    return this.promise.then(...args)
  }

  catch(...args: any) {
    return this.promise.then(...args)
  }

  static open(params: any, options: any, id: string | undefined) {
    const popup = new this(params, options, id)

    popup.open()
    popup.poll()

    return popup
  }
}

export const loginWithPopup = (
  params: any,
  options?: any,
  id?: string | string | undefined
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const popup = PopupWindow.open(params, options, id)
    popup.then(resolve, reject)
  })
}
