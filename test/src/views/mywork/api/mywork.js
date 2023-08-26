import { ajaxGetData, ajaxPostData, ajaxPutData, ajaxDeleteData, ajaxPutJson, ajaxDeleteJson, ajaxPostJson } from '@/config/ajaxService'
const VUE_APP_client_domain = process.env.VUE_APP_client_domain
const myworkApi = {
  getTestApi (params) { // 获取所有树
    return ajaxGetData({ url: `${VUE_APP_client_domain}/users`, params: params })
  }
}
export default myworkApi
