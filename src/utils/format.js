// 格式化请求数据
export function formatRequestData(keyData, requestData) {
  const data = {}
  // requestData 里面有的key 都从 keyData 里拿出来
  for (let key in keyData) {
    if (Object.keys(requestData).includes(key)) {
      data[key] = requestData[key]
    }
  }
  return data;
}