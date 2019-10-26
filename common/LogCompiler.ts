import { ProxyData, LogMessage } from './Types'

export default class LogCompiler {
  public static insertProxy(data: ProxyData, page: number): LogMessage {
    let message: string = ''

    message += `Событие: добавлено в БД<br>`
    message += `Прокси: ${data.ip}<br>`
    message += `Страница: ${page}`

    return {
      date: new Date().getTime(),
      message: message
    }
  }

  public static updateProxy(data: ProxyData, page: number): LogMessage {
    let message: string = ''

    message += `Событие: обновлено в БД<br>`
    message += `Прокси: ${data.ip}<br>`
    message += `Страница: ${page}`

    return {
      date: new Date().getTime(),
      message: message
    }
  }

  public static setPageError(page: number): LogMessage {
    return {
      date: new Date().getTime(),
      message: `Не удалось сохранить страницу №${page} в БД`
    }
  }

  public static clearPageError(): LogMessage {
    return {
      date: new Date().getTime(),
      message: 'Не удалось сбросить страницу'
    }
  }

  public static parserFinish(): LogMessage {
    return {
      date: new Date().getTime(),
      message: 'Парсер остановлен'
    }
  }

  public static notProxiesOnPage(page: number): LogMessage {
    return {
      date: new Date().getTime(),
      message: `Не найдено проксей на странице ${page}`
    }
  }
}
