<template>
  <div class="app-container">
    <div class="edit-container">
      <el-form
        ref="dataSubmitForm"
        :rules="settings.rules"
        :model="dataJson.tempJson"
        label-position="right"
        label-width="150px"
        status-icon
      >

        <el-alert
          title="基本信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="任务单号">
            {{ dataJson.tempJson.code == null || dataJson.tempJson.code == ''?'系统自动生成':dataJson.tempJson.code }}
          </el-descriptions-item>

          <el-descriptions-item label="任务状态">
            {{ dataJson.tempJson.status_name == null?'制单': dataJson.tempJson.status_name }}
          </el-descriptions-item>

          <!-- <el-descriptions-item label="物流订单单号">
            {{ dataJson.tempJson.schedule_code == null?'制单': dataJson.tempJson.schedule_code }}
          </el-descriptions-item> -->

          <el-descriptions-item label="物流合同号">
            {{ dataJson.tempJson.waybill_contract_no == null?'制单': dataJson.tempJson.waybill_contract_no }}
          </el-descriptions-item>

          <el-descriptions-item label="合同号">
            {{ dataJson.tempJson.contract_no == null?'-':dataJson.tempJson.contract_no }}
          </el-descriptions-item>

          <el-descriptions-item label="运单号">
            {{ dataJson.tempJson.waybill_code == null?'-':dataJson.tempJson.waybill_code }}
          </el-descriptions-item>

          <el-descriptions-item label="承运商">
            {{ dataJson.tempJson.customer_name == null?'-':dataJson.tempJson.customer_name }}
          </el-descriptions-item>

          <el-descriptions-item label="司机(手机号)">
            {{ dataJson.tempJson.driver_name == null?'-':dataJson.tempJson.driver_name }}({{ dataJson.tempJson.driver_mobile_phone == null?'-':dataJson.tempJson.driver_mobile_phone }})
          </el-descriptions-item>

          <el-descriptions-item label="车牌号">
            {{ dataJson.tempJson.vehicle_no == null?'-':dataJson.tempJson.vehicle_no }}
          </el-descriptions-item>

          <el-descriptions-item label="验车状态">
            {{ dataJson.tempJson.validate_vehicle == true?'验车通过':'验车失败' }}{{ dataJson.tempJson.validate_time == null?'':'('+formatDateTime(dataJson.tempJson.validate_time)+')' }}<br class="br">
            <span v-if="dataJson.tempJson.gps_time != null">车辆定位时间{{ dataJson.tempJson.gps_time == null?'':'('+formatDateTime(dataJson.tempJson.gps_time)+')' }}</span>
          </el-descriptions-item>

          <el-descriptions-item label="损耗">
            <span :class="dataJson.tempJson.qty_loss<0?'font-class-red':''">
              {{ dataJson.tempJson.qty_loss == null?'0':formatNumber(Math.abs(dataJson.tempJson.qty_loss)) }}
            </span>
          </el-descriptions-item>

          <el-descriptions-item label="创建人">
            {{ dataJson.tempJson.c_name == null?'-':dataJson.tempJson.c_name }}
          </el-descriptions-item>

          <el-descriptions-item label="创建时间">
            {{ dataJson.tempJson.c_time == null?'-':formatDateTime(dataJson.tempJson.c_time) }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="dataJson.tempJson.status =='8'"
            label="作废理由"
          >
            {{ dataJson.tempJson.cancel_remark }}
          </el-descriptions-item>

        </el-descriptions>

        <br>
        <el-alert
          title="发货信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item label="类型">
            {{ dataJson.tempJson.out_type_name == null ?'-':dataJson.tempJson.out_type_name }}
          </el-descriptions-item>

          <el-descriptions-item label="发货地">
            {{ dataJson.tempJson.out_warehouse_name == null?'-': dataJson.tempJson.out_warehouse_name }}
          </el-descriptions-item>

          <el-descriptions-item label="发货地类型">
            {{ dataJson.tempJson.out_warehouse_type_name == null?'-': dataJson.tempJson.out_warehouse_type_name }}
          </el-descriptions-item>

          <el-descriptions-item label="发货详细地址">
            {{ dataJson.tempJson.out_warehouse_address == null?'-': dataJson.tempJson.out_warehouse_address }}
          </el-descriptions-item>

          <el-descriptions-item label="出库计划单号">
            {{ dataJson.tempJson.out_plan_code == null?'-':dataJson.tempJson.out_plan_code }}
          </el-descriptions-item>

          <el-descriptions-item label="出库单号">
            {{ dataJson.tempJson.out_code == null?'-':dataJson.tempJson.out_code }}
          </el-descriptions-item>

          <el-descriptions-item label="出库/提货时间">
            {{ dataJson.tempJson.out_time == null?'-':formatDateTime(dataJson.tempJson.out_time ) }}
          </el-descriptions-item>
          <el-descriptions-item />
          <el-descriptions-item />
        </el-descriptions>

        <br>

        <el-alert
          title="收货信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item label="类型">
            {{ dataJson.tempJson.in_type_name == null ?'-':dataJson.tempJson.in_type_name }}
          </el-descriptions-item>

          <el-descriptions-item label="收货地">
            {{ dataJson.tempJson.in_warehouse_name == null?'-': dataJson.tempJson.in_warehouse_name }}
          </el-descriptions-item>

          <el-descriptions-item label="收货地类型">
            {{ dataJson.tempJson.in_type_warehouse_name == null?'-': dataJson.tempJson.in_type_warehouse_name }}
          </el-descriptions-item>

          <el-descriptions-item label="收货详细地址">
            {{ dataJson.tempJson.in_warehouse_address == null?'-': dataJson.tempJson.in_warehouse_address }}
          </el-descriptions-item>

          <el-descriptions-item label="入库计划单号">
            {{ dataJson.tempJson.in_plan_code == null?'-':dataJson.tempJson.in_plan_code }}
          </el-descriptions-item>

          <el-descriptions-item label="入库单号">
            {{ dataJson.tempJson.in_code == null?'-':dataJson.tempJson.in_code }}
          </el-descriptions-item>

          <el-descriptions-item label="入库/卸货时间">
            {{ dataJson.tempJson.in_time == null?'-':formatDateTime(dataJson.tempJson.in_time ) }}
          </el-descriptions-item>
          <el-descriptions-item />
          <el-descriptions-item />
        </el-descriptions>

        <br>

        <el-alert
          title="商品信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item label="规格编号">
            {{ dataJson.tempJson.sku_code == null ?'-':dataJson.tempJson.sku_code }}
          </el-descriptions-item>

          <el-descriptions-item label="物料名称">
            {{ dataJson.tempJson.goods_name == null?'-': dataJson.tempJson.goods_name }}
          </el-descriptions-item>

          <el-descriptions-item label="品名">
            {{ dataJson.tempJson.pm == null?'-': dataJson.tempJson.pm }}
          </el-descriptions-item>

          <el-descriptions-item label="规格">
            {{ dataJson.tempJson.sku_name == null?'-':dataJson.tempJson.sku_name }}
          </el-descriptions-item>

          <el-descriptions-item />

          <el-descriptions-item />

        </el-descriptions>
        <br>
        <el-alert
          title="轨迹信息"
          type="info"
          :closable="false"
        />
        <br>
        <el-descriptions
          title=""
          :column="3"
          :content-style="contentStyle"
          :label-style="labelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >

          <el-descriptions-item label="车牌号">
            {{ dataJson.tempJson.vehicle_no == null?'-':dataJson.tempJson.vehicle_no }}
          </el-descriptions-item>

          <el-descriptions-item label="开始时间">
            {{ dataJson.tempJson.track_start_time == null?'-': formatDateTime(dataJson.tempJson.track_start_time) }}
          </el-descriptions-item>

          <el-descriptions-item label="结束时间">
            {{ dataJson.tempJson.track_end_time == null?'-': formatDateTime(dataJson.tempJson.track_end_time) }}
          </el-descriptions-item>

        </el-descriptions>

        <br>
        <el-alert
          :title="dataJson.tempJson.out_type_name+'信息'"
          type="info"
          :closable="false"
        />
        <br>

        <el-descriptions
          title=""
          :column="1"
          :content-style="fileContentStyle"
          :label-style="fileLabelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="1、空车过磅">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorOutVo.one_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorOutVo.two_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机承诺书"
                  :data="dataJson.tempJson.monitorOutVo.three_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="司机身份证"
                  :data="dataJson.tempJson.monitorOutVo.four_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="司机驾驶证"
                  :data="dataJson.tempJson.monitorOutVo.twelve_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="车辆行驶证"
                  :data="dataJson.tempJson.monitorOutVo.thirteen_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
          <el-descriptions-item label="2、正在装货">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorOutVo.five_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorOutVo.six_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="车侧身照片"
                  :data="dataJson.tempJson.monitorOutVo.seven_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="装货视频"
                  :data="dataJson.tempJson.monitorOutVo.eight_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
            </el-row>
            <el-row v-if="dataJson.tempJson.monitorOutVo.is_container && dataJson.tempJson.monitorOutVo.containerInfos && dataJson.tempJson.monitorOutVo.containerInfos.length>0">

              <el-alert
                :title="'集装箱信息'"
                type="info"
                :closable="false"
              />
              <br>
              <el-descriptions
                v-for="(item, i) in dataJson.tempJson.monitorOutVo.containerInfos"
                :key="i"
                title=""
                :column="3"
                :content-style="contentStyle"
                :label-style="labelStyle"
                direction="horizontal"
                border
                style="padding-right: 10px;padding-left: 10px;"
              >

                <el-descriptions-item label="集装箱号">
                  {{ item.code }}
                </el-descriptions-item>
                <el-descriptions-item label="铁运/海运运单号">
                  {{ item.waybill_code }}
                </el-descriptions-item>
                <el-descriptions-item />
                <el-descriptions-item label="毛重（吨）">
                  {{ item.gross_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="皮重（吨）">
                  {{ item.tare_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="净重（吨）">
                  {{ item.net_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="影像文件">
                  <el-row style="display: flex;flex-wrap: wrap;">
                    <el-col
                      :offset="1"
                      :span="4"
                    >
                      <previewCard
                        :show-delete="settings.showDelete"
                        :show-title="settings.showTitle"
                        title="集装箱箱号照片"
                        :data="item.file_oneVo"
                        @emitPreview="handlePreview"
                      />
                    </el-col>
                    <el-col
                      :offset="1"
                      :span="4"
                    >
                      <previewCard
                        :show-delete="settings.showDelete"
                        :show-title="settings.showTitle"
                        title="集装箱内部空箱照片"
                        :data="item.file_twoVo"
                        @emitPreview="handlePreview"
                      />
                    </el-col>
                    <el-col
                      :offset="1"
                      :span="4"
                    >
                      <previewCard
                        :show-delete="settings.showDelete"
                        :show-title="settings.showTitle"
                        title="集装箱装货视频"
                        :data="item.file_threeVo"
                        @emitPreview="handlePreview"
                      />
                    </el-col>
                    <el-col
                      :offset="1"
                      :span="4"
                    >
                      <previewCard
                        :show-delete="settings.showDelete"
                        :show-title="settings.showTitle"
                        title="磅单（司机签字）"
                        :data="item.file_fourVo"
                        @emitPreview="handlePreview"
                      />
                    </el-col>
                  </el-row>

                </el-descriptions-item>
              </el-descriptions>
            </el-row>
          </el-descriptions-item>
          <el-descriptions-item label="3、重车出库">
            <el-row v-if="dataJson.tempJson.monitorOutVo">
              <el-descriptions
                title=""
                :column="3"
                :content-style="contentStyle"
                :label-style="labelStyle"
                direction="horizontal"
                border
                style="padding-right: 10px;padding-left: 10px;"
              >

                <el-descriptions-item label="毛重（吨）">
                  {{ dataJson.tempJson.monitorOutVo.gross_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="皮重（吨）">
                  {{ dataJson.tempJson.monitorOutVo.tare_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="净重（吨）">
                  {{ dataJson.tempJson.monitorOutVo.net_weight }}
                </el-descriptions-item>
              </el-descriptions>
            </el-row>
            <br>
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorOutVo.nine_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorOutVo.ten_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                v-if="!dataJson.tempJson.monitorOutVo.is_container"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="磅单"
                  :data="dataJson.tempJson.monitorOutVo.eleven_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
        <br>
        <el-alert
          :title="dataJson.tempJson.in_type_name + '信息'"
          type="info"
          :closable="false"
        />
        <br>

        <el-descriptions
          title=""
          :column="1"
          :content-style="fileContentStyle"
          :label-style="fileLabelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="1、重车过磅">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorInVo.one_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorInVo.two_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="行车轨迹"
                  :data="dataJson.tempJson.monitorInVo.ten_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          title=""
          :column="1"
          :content-style="fileContentStyle"
          :label-style="fileLabelStyle"
          direction="horizontal"
          border
          style="padding-right: 10px;padding-left: 10px;"
        >
          <el-descriptions-item label="2、重车卸货">
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorInVo.three_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorInVo.four_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="车侧身照片"
                  :data="dataJson.tempJson.monitorInVo.five_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="卸货视频"
                  :data="dataJson.tempJson.monitorInVo.six_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
            </el-row>
            <el-row v-if="dataJson.tempJson.monitorInVo.is_container && dataJson.tempJson.monitorInVo.containerInfos && dataJson.tempJson.monitorInVo.containerInfos.length>0">
              <el-alert
                :title="'集装箱信息'"
                type="info"
                :closable="false"
              />
              <br>
              <el-descriptions
                v-for="(item, i) in dataJson.tempJson.monitorInVo.containerInfos"
                :key="i"
                title=""
                :column="3"
                :content-style="contentStyle"
                :label-style="labelStyle"
                direction="horizontal"
                border
                style="padding-right: 10px;padding-left: 10px;"
              >

                <el-descriptions-item
                  label="集装箱号"
                  :span="3"
                >
                  {{ item.code }}
                </el-descriptions-item>
                <el-descriptions-item
                  label="铁运/海运运单号"
                  :span="3"
                >
                  {{ item.waybill_code }}
                </el-descriptions-item>
                <el-descriptions-item label="毛重（吨）">
                  {{ item.gross_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="皮重（吨）">
                  {{ item.tare_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="净重（吨）">
                  {{ item.net_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="影像文件">
                  <el-row style="display: flex;flex-wrap: wrap;">
                    <el-col
                      :offset="1"
                      :span="4"
                    >
                      <previewCard
                        :show-delete="settings.showDelete"
                        :show-title="settings.showTitle"
                        title="集装箱箱号照片"
                        :data="item.file_oneVo"
                        @emitPreview="handlePreview"
                      />
                    </el-col>
                    <el-col
                      :offset="1"
                      :span="4"
                    >
                      <previewCard
                        :show-delete="settings.showDelete"
                        :show-title="settings.showTitle"
                        title="集装箱内部空箱照片"
                        :data="item.file_twoVo"
                        @emitPreview="handlePreview"
                      />
                    </el-col>
                    <el-col
                      :offset="1"
                      :span="4"
                    >
                      <previewCard
                        :show-delete="settings.showDelete"
                        :show-title="settings.showTitle"
                        title="集装箱卸货视频"
                        :data="item.file_threeVo"
                        @emitPreview="handlePreview"
                      />
                    </el-col>
                    <el-col
                      :offset="1"
                      :span="4"
                    >
                      <previewCard
                        :show-delete="settings.showDelete"
                        :show-title="settings.showTitle"
                        title="磅单（司机签字）"
                        :data="item.file_fourVo"
                        @emitPreview="handlePreview"
                      />
                    </el-col>
                  </el-row>

                </el-descriptions-item>
              </el-descriptions>
            </el-row>
          </el-descriptions-item>

          <el-descriptions-item label="3、空车出库">
            <el-row v-if="dataJson.tempJson.monitorInVo">
              <el-descriptions
                title=""
                :column="3"
                :content-style="contentStyle"
                :label-style="labelStyle"
                direction="horizontal"
                border
                style="padding-right: 10px;padding-left: 10px;"
              >

                <el-descriptions-item label="毛重（吨）">
                  {{ dataJson.tempJson.monitorInVo.gross_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="皮重（吨）">
                  {{ dataJson.tempJson.monitorInVo.tare_weight }}
                </el-descriptions-item>
                <el-descriptions-item label="净重（吨）">
                  {{ dataJson.tempJson.monitorInVo.net_weight }}
                </el-descriptions-item>
              </el-descriptions>
            </el-row>
            <br>
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorInVo.seven_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorInVo.eight_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
              <el-col
                v-if="!dataJson.tempJson.monitorInVo.is_container"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-title="settings.showTitle"
                  title="磅单"
                  :data="dataJson.tempJson.monitorInVo.nine_fileVo"
                  @emitPreview="handlePreview"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>

        </el-descriptions>
        <br>

      </el-form>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-divider />
      <el-button-group class="floatRight">
        <el-button
          style="margin-left:10px"
          :disabled="settings.loading"
          size="medium"
          @click="handleCancel()"
        >返回</el-button>
      </el-button-group>

    </div>
  </div>
</template>

<style scoped>
.count {
  display: inline-block;
  height: 30px;
  text-align: center;
  line-height: 30px;
}
br {
  display: block;
  margin: 10px;
  content: ' ';
}
.br {
  display: block;
  margin: 0px;
  content: ' ';
}
.edit-container {
  height: calc(100vh - 160px);
  overflow-x: auto;
}
.dialog-footer {
  text-align: center;
}
.floatRight {
  float: right;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.required-mark::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
.font-class-red {
  color: #f00;
}
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getApi, auditInApi, auditOutApi } from '@/api/40_business/monitor/monitorbackup'
import permission from '@/directive/permission/index.js' // 权限判断指令
import previewCard from '@/components/50_preview_card/preview_card_zl'
// import constants_program from '@/common/constants/constants_program'

export default {
  components: { previewCard },
  directives: { elDragDialog, permission },
  mixins: [],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    data: {
      type: Object,
      default: null
    },
    editStatus: {
      type: String,
      default: constants_para.STATUS_INSERT
    }
  },
  data () {
    return {
      // 监听器
      watch: {
      },
      contentStyle: {
        width: '15%'
      },
      labelStyle: {
        width: '6%',
        'text-align': 'right'
      },
      fileLabelStyle: {
        width: '2%',
        'text-align': 'right'
      },
      fileContentStyle: {
        'text-align': 'center',
        width: '20%'
      },
      popSettingsData: {
        // 弹出窗口状态名称
        dialogStatus: '',
        dialogFormVisible: false,
        btnDisabledStatus: {
          disabledOK: false
        },
        // 弹出的查询框参数设置
        searchDialogDataOne: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          },
          title: '委托方'
        },
        // 弹出的行业查询框参数设置
        searchDialogDataTwo: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          },
          title: '货主'
        },
        // 弹出的查询框参数设置
        searchDialogDataThree: {
          // 弹出框显示参数
          visible: false,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          },
          title: '委托方'
        },
        // 当前条数
        nowCount: 0,
        // 弹出的仓库查询框参数设置
        searchDialogDataFour: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          },
          title: '货主'
        },
        // 弹出的规格查询框参数设置
        searchDialogDataFive: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的库区查询框参数设置
        searchDialogDataSix: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的库位查询框参数设置
        searchDialogDataSeven: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        },
        // 弹出的库位查询框参数设置
        searchDialogDataEight: {
          // 弹出框显示参数
          visible: false,
          data: null,
          // 点击确定以后返回的值
          selectedDataJson: {
            id: null
          }
        }
      },
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          code: '',
          monitorOutVo: {
            one_fileVo: undefined,
            two_fileVo: undefined,
            three_fileVo: undefined,
            four_fileVo: undefined,
            five_fileVo: undefined,
            six_fileVo: undefined,
            seven_fileVo: undefined,
            eight_fileVo: undefined,
            nine_fileVo: undefined,
            containerInfos: undefined
          },
          monitorInVo: {
            one_fileVo: undefined,
            two_fileVo: undefined,
            three_fileVo: undefined,
            four_fileVo: undefined,
            five_fileVo: undefined,
            six_fileVo: undefined,
            seven_fileVo: undefined,
            eight_fileVo: undefined,
            nine_fileVo: undefined,
            ten_fileVo: undefined,
            elevenn_fileVo: undefined,
            containerInfos: undefined
          }
        },
        // 单条数据 json
        tempJson: {
          code: '',
          monitorOutVo: {
            one_fileVo: undefined,
            two_fileVo: undefined,
            three_fileVo: undefined,
            four_fileVo: undefined,
            five_fileVo: undefined,
            six_fileVo: undefined,
            seven_fileVo: undefined,
            eight_fileVo: undefined,
            nine_fileVo: undefined,
            containerInfos: undefined
          },
          monitorInVo: {
            one_fileVo: undefined,
            two_fileVo: undefined,
            three_fileVo: undefined,
            four_fileVo: undefined,
            five_fileVo: undefined,
            six_fileVo: undefined,
            seven_fileVo: undefined,
            eight_fileVo: undefined,
            nine_fileVo: undefined,
            ten_fileVo: undefined,
            elevenn_fileVo: undefined,
            containerInfos: undefined
          }
        },
        inputSettings: {
          maxLength: {
          }
        }
      },
      // 页面设置json
      settings: {
        showOutAudit: false,
        showInAudit: false,
        showDelete: false,
        showTitle: true,
        // loading 状态
        loading: true,
        loading_prev: true,
        loading_next: true,
        loading_audit_in: true,
        loading_audit_out: true,
        // tableHeight: this.setUIheight(),
        duration: 4000,

        // 按钮状态：是否可用，false:可用，true不可用
        btnDisabledStatus: {
          disabledInsert: true,
          disabledUpdate: true
        },
        // 以下为pop的内容：数据弹出框
        selection: [],
        dialogStatus: this.editStatus,
        // pop的check内容
        rulesOne: {

        },
        rules: {

        }
      },
      popSettings: {
        // 弹出编辑页面
        one: {
          visible: false,
          props: {
            index: 0,
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        }
      }
    }
  },
  computed: {
    // 总条数
    listCount () {
      if (this.editStatus === 'audit') {
        return this.data.audit_ids.length
      } else {
        return 0
      }
    }
  },
  // 监听器
  watch: {},
  created () {
    this.init()
  },
  mounted () {
    // 描绘完成
  },
  destroyed () {
  },
  methods: {
    // 初始化处理
    init () {
      this.settings.loading = true
      // this.dataJson.tempJson = this.data
      this.settings.rules = this.settings.rulesOne
      this.initViewModel()
      this.settings.loading = false
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(this).dataJson.tempJsonOriginal
    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.getData()
    },

    // 取消按钮
    handleCancel () {
      const operate_tab_data = {
        data: this.data
      }
      // if (history.state.pushState) {
      //   // 如果是列表页面过来的，可以直接返回
      //   window.history.go(-1)
      // } else {
      //   // 如果是直接打开的，返回查询页面
      //   // 全部
      //   this.$router.push({ name: constants_program.P_MONITOR })
      // }
      this.$router.push({
        // path: '/monitor/detail',
        query: {}
      })
      this.$emit('emitReturn', operate_tab_data)
    },
    // 上一条
    // handlePrev () {
    //   if (this.editStatus === constants_para.STATUS_VIEW) {
    //     this.data.id = this.dataJson.tempJson.prev_id
    //     this.data.no = this.data.no - 1
    //     window.history.replaceState({ pushState: true }, '', `#${this.$route.path}?p2=${this.data.id}`)
    //     this.settings.loading = true
    //     this.getData()
    //   } else {
    //     this.handleAuditPrev()
    //   }
    // },
    // 下一条
    // handleNext () {
    //   this.data.id = this.dataJson.tempJson.next_id
    //   this.data.no = this.data.no + 1
    //   alert(this.data.no)

    //   window.history.replaceState({ pushState: true }, '', `#${this.$route.path}?p2=${this.data.id}`)
    //   this.settings.loading = true
    //   this.getData()
    // },

    // 审核状态下一条
    handleAuditNext () {
      const { audit_ids } = this.data
      const index = audit_ids.indexOf(this.data.id)
      if (index < audit_ids.length - 1) {
        this.data.id = audit_ids[index + 1]
        this.dataJson.tempJson.next_id = audit_ids[index + 1]
        if (index === 0) {
          this.settings.loading_prev = true
        }
      } else {
        this.data.id = audit_ids[audit_ids.length - 1]
      }
      window.history.replaceState({ pushState: true }, '', `#${this.$route.path}?p2=${this.data.id}`)
      this.settings.loading = true
      this.getData()
    },

    // 审核状态上一条
    handleAuditPrev () {
      const { audit_ids } = this.data
      // 上一条下一条按钮
      const index = audit_ids.indexOf(this.data.id)
      if (index !== 0) {
        if (index < audit_ids.length) {
          console.log('上一条', audit_ids[index - 1])
          this.dataJson.tempJson.prev_id = audit_ids[index - 1]
          this.data.id = audit_ids[index - 1]
        }
      }
      window.history.replaceState({ pushState: true }, '', `#${this.$route.path}?p2=${this.data.id}`)
      this.settings.loading = true
      this.getData()
    },

    getData () {
      // 查询逻辑
      this.settings.loading = true
      this.showLoading('正在查询，请稍后...')
      getApi(this.data).then(response => {
        this.dataJson.tempJson = deepCopy(response.data)

        // 预览附件查询
        this.getMonitorFile()

        if (this.editStatus === constants_para.STATUS_AUDIT) {
          this.settings.loading_next = false
          this.settings.loading_prev = false
          const { audit_ids } = this.data
          // 上一条下一条按钮
          const index = audit_ids.indexOf(this.data.id)
          this.dataJson.nowCount = index + 1
          if (index !== 0) {
            if (index < audit_ids.length) {
              this.dataJson.tempJson.prev_id = audit_ids[index - 1]
            }
          }
          if (audit_ids.length >= 2) {
            // 如果有两条, 下一条按钮高亮
            if (index < audit_ids.length - 1) {
              this.dataJson.tempJson.next_id = audit_ids[index + 1]
            }
          }
        }
        // this.getNextData()

        // this.getPrevData

        // 卸货完成才能入库审核
        if (this.dataJson.tempJson.status === '7') {
          this.settings.showInAudit = true
        } else {
          this.settings.showInAudit = false
        }

        // 装货完成才能出库审核
        if (this.dataJson.tempJson.status === '3' || this.dataJson.tempJson.status === '4' || this.dataJson.tempJson.status === '5' || this.dataJson.tempJson.status === '6' || this.dataJson.tempJson.status === '7') {
          this.settings.showOutAudit = true
        } else {
          this.settings.showOutAudit = false
        }

        if (this.dataJson.tempJson.audit_status === '2') {
          this.settings.showOutAudit = false
          this.settings.showInAudit = false
        }

        if (this.dataJson.tempJson.audit_status === '3') {
          this.settings.showOutAudit = false
        }

        if (this.dataJson.tempJson.audit_status === '4') {
          this.settings.showInAudit = false
        }

        if (this.dataJson.tempJson.monitorOutVo === null) {
          this.dataJson.tempJson.monitorOutVo = deepCopy(this.dataJson.tempJsonOriginal.monitorOutVo)
        }
        if (this.dataJson.tempJson.monitorInVo === null) {
          this.dataJson.tempJson.monitorInVo = deepCopy(this.dataJson.tempJsonOriginal.monitorInVo)
        }
      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
      })
    },
    // 审核按钮
    handleAudit () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      selectionJson.push({ 'id': this.data.id })
      // 开始审核
      auditInApi(selectionJson).then((_data) => {
        this.$notify({
          title: '审核成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.handleAuditNext()
        // if (this.dataJson.tempJson.next_id !== null && this.dataJson.tempJson.next_id !== undefined) {
        //   this.handleAuditNext()
        // }
        // loading
      }, (_error) => {
        this.$notify({
          title: '审核错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 出库审核按钮
    handleReturn () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      selectionJson.push({ 'id': this.data.id })

      // 开始出库审核
      auditOutApi(selectionJson).then((_data) => {
        this.$notify({
          title: '审核成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.handleAuditNext()
        // if (this.dataJson.tempJson.next_id !== null && this.dataJson.tempJson.next_id !== undefined) {
        //   this.handleAuditNext()
        // }
        // loading
      }, (_error) => {
        this.$notify({
          title: '审核错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
      })
    },
    handlePreview (url) {
      // this.popSettings.one.visible = true
      const index = this.dataJson.tempJson.preview_data.findIndex(item => {
        return item.url === url
      })

      // this.popSettings.one.props.index = index

      // this.dataJson.tempJson.preview_data

      const { href } = this.$router.resolve({
        path: `/previewbackup`,
        query: {
          code: this.dataJson.tempJson.code,
          type: 'monitor',
          index: index
        }
      })
      window.open(href, '_blank')
    },

    getMonitorFile () {
      // 查询逻辑
      console.log(this.dataJson.tempJson.previewFiles)
      this.dataJson.tempJson.preview_data = deepCopy(this.dataJson.tempJson.previewFiles)
      //   const temp = {}
      //   temp.id = this.dataJson.tempJson.id
      //   getMonitorFileApi(temp).then(response => {
      //     this.dataJson.tempJson.preview_data = deepCopy(response.data.preview_data)
      //     this.popSettings.one.props.data = deepCopy(this.dataJson.tempJson.preview_data)
      //   }).finally(() => {
      //   })
    }

  }

}
</script>
