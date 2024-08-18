import Taro from "@tarojs/taro";

import { View, Picker } from "@tarojs/components";
import moment from "moment";
import { AtList, AtListItem, AtButton, AtNoticebar } from "taro-ui";
import "./parameters.less";
import { useState } from "react";
import { get as getGlobalData } from "../global_data";

function stringToBytes(str) {
  var array = new Uint8Array(str.length);
  for (var i = 0, l = str.length; i < l; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer;
}

export default function Parameters() {
  // 获取时间
  const [dateSel, setDateSel] = useState("");
  function getTime() {
    const time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    setDateSel(time);
  }
  setInterval(() => {
    getTime();
  }, 100);



  // 主题
  const [selector] = useState(["主题一", "主题二", "主题三", "测试主题四", "测试主题五", "测试主题六"]);
  const [selectorChecked, setselectorChecked] = useState("主题一");//页面默认主题1

  function onChange(e) {
    setselectorChecked(selector[e.detail.value]);
  }

  // 屏幕方向      ---HUA 添加
  const [selecttopic] = useState(["上", "DBT开头设备不支持", "下"]);
  const [selectTopic, setselectTopic] = useState("上");

  function onTopic(e) {
    setselectTopic(selecttopic[e.detail.value]);
  }
  // 小电流开关
  const [selectsmalla] = useState(["关", "开", "DBT开头设备不支持"]);
  const [selectSmalla, setselectSmalla] = useState("关");

  function onSmallA(e) {
    setselectSmalla(selectsmalla[e.detail.value]);
  }


  // 亮屏时间
  const [array] = useState([30, 60, 90, 120, 0]);//亮屏时间定义    0常亮
  const [btsleeptime, setBtsleeptime] = useState(30);//默认30s

  function onbtsleeptimeChange(e) {
    setBtsleeptime(array[e.detail.value]);
  }

  // 蓝牙时间     --HUA 添加
  const [array2] = useState([150, 600, 1800, 3600]);//蓝牙开启时间  
  const [bletime, setBletime] = useState(150);//

  function onbletimeChange(e) {
    setBletime(array2[e.detail.value]);
  }

  function save() {
    const theme = selector.findIndex((item) => item == selectorChecked);
    const topic = selecttopic.findIndex((item) => item == selectTopic);
    const smalla = selectsmalla.findIndex((item) => item == selectSmalla);
    // 发送内容  前为发送字段，后为发送内容
    const eventParams = {
      btthem: theme + 1, // 数组下标
      bttopic: topic + 1,
      btsmalla: smalla,
      btsleeptime: btsleeptime,
      bttime: bletime,
      btyear: moment(new Date()).format("YYYY"),
      btmon: moment(new Date()).format("MM"),
      btday: moment(new Date()).format("DD"),
      bthour: moment(new Date()).format("HH"),
      btmin: moment(new Date()).format("mm"),
      btsec: moment(new Date()).format("ss"),
      btweek: moment(new Date()).format("E"),
    };
    console.log(eventParams);
    // 向蓝牙设备发送一个0x00的16进制数据
    let buffer = stringToBytes(JSON.stringify(eventParams)); // new ArrayBuffer();

    const { deviceId, serviceId, characteristicId } = getGlobalData("ID");

    Taro.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
      deviceId,
      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
      serviceId,
      // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
      characteristicId,
      // 这里的value是ArrayBuffer类型
      value: buffer,
      success: function (res) {
        console.log("writeBLECharacteristicValue success", res.errMsg);
        Taro.showToast({
          title: "发送成功",
          icon: "error",
          duration: 2000,
        });
        cancel();
      },
    });
  }
  function cancel() {
    // 在C页面内 navigateBack，将返回A页面
    Taro.navigateBack({
      delta: 1,
    });
  }
  return (
    <View>
      <AtNoticebar className="gonggao">注: 测试主题, 屏幕方向, 小电流将不支持DBT开头设备----若功能无反应代表您的设备不支持----Q交流群: 1004300610</AtNoticebar>
      <View className="myItem">
        <View className="item-content">时间校准</View>
        <View className="item-extra">{dateSel}</View>
      </View>

      <Picker mode="selector" range={selector} onChange={onChange}>
        <AtList>
          <AtListItem title="主题号" extraText={selectorChecked} />
        </AtList>
      </Picker>

      <Picker mode="selector" range={selecttopic} onChange={onTopic}>
        <AtList>
          <AtListItem title="屏幕方向" extraText={selectTopic} />
        </AtList>
      </Picker>


      {/*  <AtList>
        <AtListItem
          title="休眠时间(秒)"
          note="范围:0-65535，-1不休眠"
          extraText="30"
        />
      </AtList> */}
      <Picker mode="selector" range={array} onChange={onbtsleeptimeChange}>
        <AtList>
          <AtListItem title="亮屏时间" extraText={`${btsleeptime}`} />
        </AtList>
      </Picker>

      <Picker mode="selector" range={array2} onChange={onbletimeChange}>
        <AtList>
          <AtListItem title="蓝牙时间" extraText={`${bletime}`} />
        </AtList>
      </Picker>

      <Picker mode="selector" range={selectsmalla} onChange={onSmallA}>
        <AtList>
          <AtListItem title="小电流" extraText={selectSmalla} />
        </AtList>
      </Picker>




      {/* <AtForm>
        <AtSwitch title='开启中' checked={this.state.value} onChange={this.handleChange} />
        <AtSwitch title='已禁止' disabled onChange={this.handleChange} />
        <AtSwitch border={false} title='已关闭' />
      </AtForm> */}



      <View className="btnGroup">
        <AtButton type="primary" circle onClick={save}>
          确认
        </AtButton>
        <AtButton type="secondary" circle onClick={cancel}>
          取消
        </AtButton>


      </View>
    </View>
  );
}
