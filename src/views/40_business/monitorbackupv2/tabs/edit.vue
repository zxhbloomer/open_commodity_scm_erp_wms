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

          <el-descriptions-item label="物流订单单号">
            {{ dataJson.tempJson.schedule_code == null?'制单': dataJson.tempJson.schedule_code }}
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
            {{ dataJson.tempJson.driver_name == null?'-':dataJson.tempJson.driver_name }} {{ '(' + dataJson.tempJson.driver_mobile_phone + ')' }}
            <!-- <input-search
              v-model.trim="dataJson.tempJson.driver_name"
              :disabled="isUpdateModel && isViewModel"
              @onInputSearch="handleDriverDialog"
            /> -->
          </el-descriptions-item>

          <el-descriptions-item label="车牌号">
            {{ dataJson.tempJson.vehicle_no == null?'-':dataJson.tempJson.vehicle_no }}
            <!-- <input-search
              v-model.trim="dataJson.tempJson.vehicle_no"
              :disabled="isUpdateModel && isViewModel"
              @onInputSearch="handleVehicleDialog"
            /> -->
          </el-descriptions-item>

          <el-descriptions-item label="验车状态">
            <span class="fontCenter">{{ dataJson.tempJson.validate_vehicle == true?'验车通过':'验车失败' }}{{ dataJson.tempJson.validate_time == null?'':'('+formatDateTime(dataJson.tempJson.validate_time)+')' }}<br class="br">
              <span v-if="dataJson.tempJson.gps_time != null">车辆定位时间{{ dataJson.tempJson.gps_time == null?'':'('+formatDateTime(dataJson.tempJson.gps_time)+')' }}</span></span>
            <el-button
              class="floatRight"
              icon="el-icon-zoom-in"
              :loading="settings.loading"
              type="primary"
              @click="handleBasicEdit"
            >维护</el-button>
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
            <!-- <el-button
              :disabled="dataJson.tempJson.status !== '7'"
              class="floatRight"
              type="primary"
              icon="el-icon-zoom-in"
              :loading="settings.loading"
              @click="getTrack"
            >重新获取轨迹</el-button> -->
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
          <el-descriptions-item
            v-if="dataJson.tempJson.status>=0"
            label="1、空车过磅"
          >
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorOutVo.one_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessOutOne"
                  @upload-error="replaceError"
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
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorOutVo.two_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessOutTwo"
                  @upload-error="replaceError"
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
                  title="司机承诺书"
                  :data="dataJson.tempJson.monitorOutVo.three_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessOutThree"
                  @upload-error="replaceError"
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
                  @upload-success="replaceSucessOutFour"
                  @upload-error="replaceError"
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
                  @upload-success="replaceSuccessOutTwelve"
                  @upload-error="replaceError"
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
                  @upload-success="replaceSuccessOutThirteen"
                  @upload-error="replaceError"
                />
              </el-col>
            </el-row>
          </el-descriptions-item>
          <el-descriptions-item
            v-if="dataJson.tempJson.status>=1"
            label="2、正在装货"
          >
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorOutVo.five_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessOutFive"
                  @upload-error="replaceError"
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
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorOutVo.six_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessOutSix"
                  @upload-error="replaceError"
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
                  title="车侧身照片"
                  :data="dataJson.tempJson.monitorOutVo.seven_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessOutSeven"
                  @upload-error="replaceError"
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
                  title="装货视频"
                  :data="dataJson.tempJson.monitorOutVo.eight_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessOutEight"
                  @upload-error="replaceError"
                />
              </el-col>
            </el-row>
            <el-row v-if="dataJson.tempJson.monitorOutVo.is_container &&dataJson.tempJson.monitorOutVo.containerInfos && dataJson.tempJson.monitorOutVo.containerInfos.length>0">

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
                        :show-update="settings.showUpdate"
                        :show-title="settings.showTitle"
                        title="集装箱箱号照片"
                        :idx="i"
                        :data="item.file_oneVo"
                        @emitPreview="handlePreview"
                        @upload-success="replaceSucessOutContainerOne"
                        @upload-error="replaceError"
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
                        title="集装箱内部空箱照片"
                        :idx="i"
                        :data="item.file_twoVo"
                        @emitPreview="handlePreview"
                        @upload-success="replaceSucessOutContainerTwo"
                        @upload-error="replaceError"
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
                        title="集装箱装货视频"
                        :idx="i"
                        :data="item.file_threeVo"
                        @emitPreview="handlePreview"
                        @upload-success="replaceSucessOutContainerThree"
                        @upload-error="replaceError"
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
                        title="磅单（司机签字）"
                        :idx="i"
                        :data="item.file_fourVo"
                        @emitPreview="handlePreview"
                        @upload-success="replaceSucessOutContainerFour"
                        @upload-error="replaceError"
                      />
                    </el-col>
                  </el-row>

                </el-descriptions-item>
              </el-descriptions>
            </el-row>
          </el-descriptions-item>
          <el-descriptions-item
            v-if="dataJson.tempJson.status>=2"
            label="3、重车出库"
          >
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
                  <el-button
                    :disabled="dataJson.tempJson.status < '4'"
                    class="floatRight"
                    type="primary"
                    icon="el-icon-zoom-in"
                    :loading="settings.loading"
                    @click="handleUpdateOut"
                  >维护</el-button>
                </el-descriptions-item>
                <el-descriptions-item label="出库单号">
                  {{ dataJson.tempJson.out_code }}
                </el-descriptions-item>
                <el-descriptions-item label="出库数量（吨）">
                  {{ dataJson.tempJson.monitorOutVo.qty }}
                </el-descriptions-item>
                <el-descriptions-item label="出库单状态">
                  {{ dataJson.tempJson.out_status_name }}

                  <!-- <router-link :to="{path:'/out/bill',query:{code:dataJson.tempJson.monitorInVo.out_code}}"> -->
                  <el-button
                    :disabled="dataJson.tempJson.out_status == null || dataJson.tempJson.out_status==='4'"
                    class="floatRight"
                    type="primary"
                    icon="el-icon-circle-close"
                    :loading="settings.loading"
                    @click="handleOutCancel"
                  >
                    作废
                  </el-button>
                  <!-- </router-link> -->
                  &nbsp;
                  <el-button
                    style="margin-right:5px"
                    class="floatRight"
                    type="primary"
                    icon="el-icon-refresh-right"
                    :loading="settings.loading"
                    @click="getData"
                  >刷新</el-button>
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
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorOutVo.nine_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessOutNine"
                  @upload-error="replaceError"
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
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorOutVo.ten_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessOutTen"
                  @upload-error="replaceError"
                />
              </el-col>
              <el-col
                v-if="!dataJson.tempJson.monitorOutVo.is_container"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="磅单"
                  :data="dataJson.tempJson.monitorOutVo.eleven_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessOutEleven"
                  @upload-error="replaceError"
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
          <el-descriptions-item
            v-if="dataJson.tempJson.status>=4"
            label="1、重车过磅"
          >
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorInVo.one_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessInOne"
                  @upload-error="replaceError"
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
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorInVo.two_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessInTwo"
                  @upload-error="replaceError"
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
                  title="行车轨迹"
                  :data="dataJson.tempJson.monitorInVo.ten_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessInTen"
                  @upload-error="replaceError"
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
          <el-descriptions-item
            v-if="dataJson.tempJson.status>=5"
            label="2、重车卸货"
          >
            <el-row style="display: flex;flex-wrap: wrap;">
              <el-col
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorInVo.three_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessInThree"
                  @upload-error="replaceError"
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
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorInVo.four_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessInFour"
                  @upload-error="replaceError"
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
                  title="车侧身照片"
                  :data="dataJson.tempJson.monitorInVo.five_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessInFive"
                  @upload-error="replaceError"
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
                  title="卸货视频"
                  :data="dataJson.tempJson.monitorInVo.six_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessInSix"
                  @upload-error="replaceError"
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
                        :show-update="settings.showUpdate"
                        :show-title="settings.showTitle"
                        title="集装箱箱号照片"
                        :data="item.file_oneVo"
                        :idx="i"
                        @emitPreview="handlePreview"
                        @upload-success="replaceSucessInContainerOne"
                        @upload-error="replaceError"
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
                        title="集装箱内部空箱照片"
                        :data="item.file_twoVo"
                        :idx="i"
                        @emitPreview="handlePreview"
                        @upload-success="replaceSucessInContainerTwo"
                        @upload-error="replaceError"
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
                        title="集装箱卸货视频"
                        :data="item.file_threeVo"
                        :idx="i"
                        @emitPreview="handlePreview"
                        @upload-success="replaceSucessInContainerThree"
                        @upload-error="replaceError"
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
                        title="磅单（司机签字）"
                        :data="item.file_fourVo"
                        :idx="i"
                        @emitPreview="handlePreview"
                        @upload-success="replaceSucessInContainerFour"
                        @upload-error="replaceError"
                      />
                    </el-col>
                  </el-row>

                </el-descriptions-item>
              </el-descriptions>
            </el-row>
          </el-descriptions-item>

          <el-descriptions-item
            v-if="dataJson.tempJson.status>=6"
            label="3、空车出库"
          >
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
                  <el-button
                    :disabled="dataJson.tempJson.status < '7' "
                    class="floatRight"
                    type="primary"
                    icon="el-icon-zoom-in"
                    :loading="settings.loading"
                    @click="handleUpdateIn"
                  >维护</el-button>
                </el-descriptions-item>
                <el-descriptions-item label="入库单号">
                  {{ dataJson.tempJson.in_code }}
                </el-descriptions-item>
                <el-descriptions-item label="入库数量（吨）">
                  {{ dataJson.tempJson.monitorInVo.qty }}
                </el-descriptions-item>
                <el-descriptions-item label="入库单状态">
                  {{ dataJson.tempJson.in_status_name }}

                  <!-- <router-link :to="{path:'/in/bill',query:{code:dataJson.tempJson.monitorInVo.in_code}}"> -->
                  <el-button
                    :disabled="dataJson.tempJson.in_status == null || dataJson.tempJson.in_status==='4'"
                    class="floatRight"
                    type="primary"
                    icon="el-icon-circle-close"
                    :loading="settings.loading"
                    @click="handleInCancel"
                  >
                    作废
                  </el-button>
                  <!-- </router-link> -->
                  &nbsp;
                  <el-button
                    style="margin-right:5px"
                    class="floatRight"
                    type="primary"
                    icon="el-icon-refresh-right"
                    :loading="settings.loading"
                    @click="getData"
                  >刷新</el-button>
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
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="司机车头照片"
                  :data="dataJson.tempJson.monitorInVo.seven_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessInSeven"
                  @upload-error="replaceError"
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
                  title="司机车尾照片"
                  :data="dataJson.tempJson.monitorInVo.eight_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessInEight"
                  @upload-error="replaceError"
                />
              </el-col>
              <el-col
                v-if="!dataJson.tempJson.monitorInVo.is_container"
                :offset="1"
                :span="4"
              >
                <previewCard
                  :show-delete="settings.showDelete"
                  :show-update="settings.showUpdate"
                  :show-title="settings.showTitle"
                  title="磅单"
                  :data="dataJson.tempJson.monitorInVo.nine_fileVo"
                  @emitPreview="handlePreview"
                  @upload-success="replaceSucessInNine"
                  @upload-error="replaceError"
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

      <!-- <el-button
        v-show="settings.btnShowStatus.showInsert"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledInsert"
        size="medium"
        @click="doInsert()"
      >保存</el-button> -->
      <!-- <el-button-group
        class="floatLeft"
        style="margin-right:10px"
      >
        <el-button
          type="success"
          size="medium"
          :loading="settings.loading_prev"
          :disabled="settings.loading || !dataJson.tempJson.prev_id"
          icon="el-icon-arrow-left"
          @click="handlePrev()"
        >上一条</el-button>
        <el-button
          type="success"
          size="medium"
          :loading="settings.loading_next"
          :disabled="settings.loading || !dataJson.tempJson.next_id"
          @click="handleNext()"
        >下一条<i class="el-icon-arrow-right el-icon--right" /></el-button>
      </el-button-group> -->
      <el-button
        v-show="settings.btnShowStatus.showUpdate && !isViewModel"
        type="primary"
        :disabled="settings.loading || settings.btnDisabledStatus.disabledUpdate"
        size="medium"
        @click="doUpdate()"
      >保存</el-button>
      <el-button-group class="floatRight">
        <el-button
          style="margin-left:10px"
          :disabled="settings.loading"
          size="medium"
          @click="handleCancel()"
        >返回</el-button>
      </el-button-group>
    </div>
    <edit-out-dialog
      v-if="popSettings.one.visible"
      :data="popSettings.one.props.data"
      :visible="popSettings.one.visible"
      :dialog-status="popSettings.one.props.dialogStatus"
      @closeMeOk="handleCloseDialogOneOk"
      @closeMeCancel="handleCloseDialogOneCancel"
    />
    <edit-in-dialog
      v-if="popSettings.two.visible"
      :data="popSettings.two.props.data"
      :visible="popSettings.two.visible"
      :dialog-status="popSettings.two.props.dialogStatus"
      @closeMeOk="handleCloseDialogTwoOk"
      @closeMeCancel="handleCloseDialogTwoCancel"
    />
    <get-track-dialog
      v-if="popSettings.three.visible"
      :data="popSettings.three.props.data"
      :visible="popSettings.three.visible"
      :dialog-status="popSettings.three.props.dialogStatus"
      @closeMeOk="handleCloseDialogThreeOk"
      @closeMeCancel="handleCloseDialogThreeCancel"
    />
    <!-- <vehicle-dialog
      v-if="popSettings.four.visible"
      :visible="popSettings.four.visible"
      @closeMeOk="handleVehicleCloseOk"
      @closeMeCancel="handleVehicleCloseCancel"
    />
    <driver-dialog
      v-if="popSettings.five.visible"
      :visible="popSettings.five.visible"
      @closeMeOk="handleDriverCloseOk"
      @closeMeCancel="handleDriverCloseCancel"
    /> -->
    <basic-edit
      v-if="popSettings.six.visible"
      :visible="popSettings.six.visible"
      :data="dataJson.tempJson"
      @closeMeCancel="handleBasicCloseCancel"
      @closeMeSuccess="handleBasicCloseSuccess"
    />
    <out-cancel-confirm-dialog
      v-if="popSettings.four.visible"
      :data="popSettings.four.props.data"
      :visible="popSettings.four.visible"
      :dialog-status="popSettings.four.props.dialogStatus"
      @closeMeOk="handleCloseDialogFourOk"
      @closeMeCancel="handleCloseDialogFourCancel"
    />
    <in-cancel-confirm-dialog
      v-if="popSettings.five.visible"
      :data="popSettings.five.props.data"
      :visible="popSettings.five.visible"
      :dialog-status="popSettings.five.props.dialogStatus"
      @closeMeOk="handleCloseDialogFiveOk"
      @closeMeCancel="handleCloseDialogFiveCancel"
    />
  </div>
</template>

<style scoped>
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
.fontCenter {
  display: inline-block;
  text-align: left;
  line-height: 28px;
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
</style>

<script>
import constants_para from '@/common/constants/constants_para'
import elDragDialog from '@/directive/el-drag-dialog'
import deepCopy from 'deep-copy'
import { getApi, saveFileApi, getMonitorFileApi } from '@/api/40_business/monitor/monitorbackup'
import previewCard from '@/components/50_preview_card/preview_card_zl'
import editInDialog from '@/views/40_business/monitor/tabs/dialog/inedit'
import editOutDialog from '@/views/40_business/monitor/tabs/dialog/outedit'
import getTrackDialog from '@/views/40_business/monitor/tabs/dialog/gettrack'
import { cancelApi as cancelInApi } from '@/api/40_business/in/in'
import { cancelApi as cancelOutApi } from '@/api/40_business/out/out'
import inCancelConfirmDialog from '@/views/40_business/monitor/tabs/dialog/incancelconfirm'
import outCancelConfirmDialog from '@/views/40_business/monitor/tabs/dialog/outcancelconfirm'
// import InputSearch from '@/components/40_input/inputSearch'
// import vehicleDialog from '@/views/30_wms/vehicle/dialog/dialog'
// import driverDialog from '@/views/30_wms/driver/dialog/dialog'
import basicEdit from '@/views/40_business/monitor/tabs/dialog/basicEdit'

export default {
  components: { previewCard, editInDialog, editOutDialog, getTrackDialog, basicEdit, inCancelConfirmDialog, outCancelConfirmDialog },
  directives: { elDragDialog },
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
        unwatch_tempJson: null
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
      popSettings: {
        // 弹出编辑页面
        one: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 弹出编辑页面
        two: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 弹出编辑页面
        three: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 弹出编辑页面
        four: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 弹出编辑页面
        five: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        },
        // 弹出编辑页面
        six: {
          visible: false,
          props: {
            id: undefined,
            data: {},
            dialogStatus: ''
          }
        }
      },

      monitor_file_type: {
        // 空车过磅 司机车头
        OUT_ONE: 'out_one',
        // 空车过磅 司机车尾
        OUT_TWO: 'out_two',
        // 空车过磅 司机承诺书
        OUT_THREE: 'out_three',
        // 空车过磅 三证拍照
        OUT_FOUR: 'out_four',

        // 正在装货 车头照片
        OUT_FIVE: 'out_five',
        // 正在装货 车尾照片
        OUT_SIX: 'out_six',
        // 正在装货 车侧身附件
        OUT_SEVEN: 'out_seven',
        // 正在装货 装货视频
        OUT_EIGHT: 'out_eight',

        // 重车出库 车头照片
        OUT_NINE: 'out_nine',
        // 重车出库 车尾照片
        OUT_TEN: 'out_ten',
        // 重车出库 磅单
        OUT_ELEVEN: 'out_eleven',

        // 正在装货 集装箱箱号照片1
        OUT_CONTAINER_ONE: 'out_container_one',
        // 正在装货 集装箱内部空箱照片1
        OUT_CONTAINER_TWO: 'out_container_two',
        // 正在装货 集装箱装货视频1
        OUT_CONTAINER_THREE: 'out_container_three',
        // 正在装货 磅单1
        OUT_CONTAINER_FOUR: 'out_container_four',
        // 正在装货 箱号照片2
        OUT_CONTAINER_FIVE: 'out_container_five',
        // 正在装货 集装箱内部空箱照片2
        OUT_CONTAINER_SIX: 'out_container_six',
        // 正在装货 集装箱装货视频2
        OUT_CONTAINER_SEVEN: 'out_container_seven',
        // 正在装货 磅单2
        OUT_CONTAINER_EIGHT: 'out_container_eight',

        // 重车过磅 司机车头照片
        IN_ONE: 'in_one',
        // 重车过磅 司机车尾附件
        IN_TWO: 'in_two',
        // 重车过磅 行车轨迹
        IN_TEN: 'in_ten',

        // 重车卸货 车头照片
        IN_THREE: 'in_three',
        // 重车卸货 车尾照片
        IN_FOUR: 'in_four',
        // 重车卸货 车侧身照片
        IN_FIVE: 'in_five',
        // 重车卸货 卸货视频附
        IN_SIX: 'in_six',

        // 空车过磅 司机车头附件
        IN_SEVEN: 'in_seven',
        // 空车过磅 司机车尾附件
        IN_EIGHT: 'in_eight',
        // 空车过磅 磅单
        IN_NINE: 'in_nine',

        // 正在卸货 集装箱箱号照片1
        IN_CONTAINER_ONE: 'in_container_one',
        // 正在卸货 集装箱内部空箱照片1
        IN_CONTAINER_TWO: 'in_container_two',
        // 正在卸货 集装箱装货视频1
        IN_CONTAINER_THREE: 'in_container_three',
        // 正在卸货 磅单1
        IN_CONTAINER_FOUR: 'in_container_four',
        // 正在卸货 箱号照片2
        IN_CONTAINER_FIVE: 'in_container_five',
        // 正在卸货 集装箱内部空箱照片2
        IN_CONTAINER_SIX: 'in_container_six',
        // 正在卸货 集装箱装货视频2
        IN_CONTAINER_SEVEN: 'in_container_seven',
        // 正在卸货 磅单2
        IN_CONTAINER_EIGHT: 'in_container_eight'
      },
      dataJson: {
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
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
        tempJson: undefined,
        // 验车状态
        validateList: [
          { id: '1', value: '验车通过' },
          { id: '0', value: '验车失败' }
        ],
        inputSettings: {
          maxLength: {
          }
        }
      },
      // 页面设置json
      settings: {
        showDelete: false,
        showUpdate: true,
        showTitle: true,
        // loading 状态
        loading: true,
        loading_prev: true,
        loading_next: true,
        // tableHeight: this.setUIheight(),
        duration: 4000,
        // 按钮是否显示，默认不显示，false：不显示，true：显示
        btnShowStatus: {
          showInsert: false,
          showUpdate: false
        },
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
          },
          two: {
            visible: false,
            props: {
              index: 0,
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          },
          three: {
            visible: false,
            props: {
              index: 0,
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          },
          four: {
            visible: false,
            props: {
              index: 0,
              id: undefined,
              data: {},
              dialogStatus: ''
            }
          },
          five: {
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
    }
  },
  computed: {
    // 是否为更新模式
    isUpdateModel () {
      if (
        this.settings.dialogStatus === this.PARAMETERS.STATUS_INSERT ||
        this.settings.dialogStatus === this.PARAMETERS.STATUS_COPY_INSERT
      ) {
        return false
      } else {
        return true
      }
    },
    listenVisible () {
      return this.visible
    },
    isViewModel () {
      if (this.settings.dialogStatus === this.PARAMETERS.STATUS_VIEW) {
        return true
      } else {
        return false
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
    this.unWatch()
  },
  methods: {
    // 初始化处理
    init () {
      // this.dataJson.tempJson = this.data
      this.settings.rules = this.settings.rulesOne
      this.initButtonShowStatus()
      this.initButtonDisabledStatus()
      this.initViewModel()
      // 初始化watch
      this.setWatch()
      this.settings.loading = false
    },
    // 弹出框设置初始化
    initDialogStatus () {
    },
    initTempJsonOriginal () {
      // 单条数据 json的，初始化原始数据
      this.dataJson.tempJsonOriginal = this.$options.data.call(this).dataJson.tempJsonOriginal
    },
    initButtonShowStatus () {
      // 初始化按钮状态：默认都隐藏
      this.settings.btnShowStatus = this.$options.data.call(this).settings.btnShowStatus
    },
    initButtonDisabledStatus () {
      // 按钮状态初始化：默认不可用
      this.settings.btnDisabledStatus = this.$options.data.call(this).settings.btnDisabledStatus
    },
    // 新增时的初始化
    initInsertModel () {
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      if (this.isViewModel) {
        return ''
      } else {
        return val
      }
    },
    // 修改时的初始化
    initUpdateModel () {

    },
    // 查看时的初始化
    initViewModel () {
      // 数据初始化
      this.initTempJsonOriginal()
      this.dataJson.tempJson = deepCopy(this.dataJson.tempJsonOriginal)
      // 数据初始化
      this.getData()
    },
    // 设置监听器
    setWatch () {
      this.unWatch()
      // 监听页面上面是否有修改，有修改按钮高亮
      this.watch.unwatch_tempJson = this.$watch(
        'dataJson.tempJson',
        (newVal, oldVal) => {
          this.settings.btnDisabledStatus.disabledInsert = false
          this.settings.btnDisabledStatus.disabledUpdate = false
        },
        { deep: true }
      )
    },
    unWatch () {
      if (this.watch.unwatch_tempJson) {
        this.watch.unwatch_tempJson()
      }
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
        query: {}
      })

      this.$emit('emitReturn', operate_tab_data)
    },
    handleTabsClick (tab, event) { },
    // 开始综合验证
    doValidateByTabs () {
      // 第一个tabs
      this.settings.rules = this.settings.rulesOne
      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
      this.$refs['dataSubmitForm'].validate((valid, validateItems) => {
        if (valid === false) {
          this.settings.badge.countOne = Object.keys(validateItems).length
        } else {
          this.settings.badge.countOne = 0
        }
      })
      // 所有的数据进行验证
      this.doValidateAllRules()
    },
    // 所有的数据开始validate
    doValidateAllRules () {
      if (this.isLoginEnabled) {
        this.settings.rules = { ...this.settings.rulesOne, ...this.settings.rulesTwo }
      } else {
        this.settings.rules = { ...this.settings.rulesOne }
      }

      this.$refs['dataSubmitForm'].rules = this.settings.rules
      this.$refs['dataSubmitForm'].clearValidate()
    },
    // 上一条
    handlePrev () {
      this.data.id = this.dataJson.tempJson.prev_id
      this.data.no = this.data.no - 1

      window.history.pushState({ pushState: true }, '', `#${this.$route.path}?p2=${this.data.id}`)
      this.settings.loading = true
      this.getData()
    },
    // 下一条
    handleNext () {
      this.data.id = this.dataJson.tempJson.next_id
      this.data.no = this.data.no + 1

      window.history.pushState({ pushState: true }, '', `#${this.$route.path}?p2=${this.data.id}`)
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

        // // 获取上一条数据
        // this.getPrevData()
        // // 获取下一条数据
        // this.getNextData()

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
    handleUpdateOut () {
      if (this.dataJson.tempJson.out_status !== null && this.dataJson.tempJson.out_status !== '4') {
        this.showErrorMsg('请先作废出库单【' + this.dataJson.tempJson.out_code + '】')
        return
      }
      // 维护出库监管
      this.popSettings.one.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.one.props.data = this.dataJson.tempJson
      this.popSettings.one.visible = true
    },

    getTrack () {
      // 维护出库监管
      this.popSettings.three.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.three.props.data = this.dataJson.tempJson
      this.popSettings.three.visible = true
    },
    // 出库维护确认
    handleCloseDialogOneOk () {
      this.popSettings.one.visible = false
      this.getData()
    },
    // 出库维护取消
    handleCloseDialogOneCancel () {
      this.popSettings.one.visible = false
    },
    handleUpdateIn () {
      if (this.dataJson.tempJson.in_status !== null && this.dataJson.tempJson.in_status !== '4') {
        this.showErrorMsg('请先作废入库单【' + this.dataJson.tempJson.in_code + '】')
        return
      }
      // 维护出库监管
      this.popSettings.two.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.two.props.data = this.dataJson.tempJson
      this.popSettings.two.visible = true
    },
    // 出库维护确认
    handleCloseDialogTwoOk () {
      this.popSettings.two.visible = false
      this.getData()
    },

    // 出库维护取消
    handleCloseDialogTwoCancel () {
      this.popSettings.two.visible = false
    },
    // 重新获取轨迹
    handleCloseDialogThreeOk () {
      this.popSettings.three.visible = false
      this.getData()
    },
    // 重新获取轨迹取消
    handleCloseDialogThreeCancel () {
      this.popSettings.three.visible = false
    },
    replaceSucessOutOne (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.one_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = deepCopy(this.data)
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_ONE
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        tempData.u_time = _data.data.u_time
        tempData.u_name = _data.data.u_name
        tempData.u_phone = _data.data.u_phone
        this.dataJson.tempJson.monitorOutVo.one_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessOutTwo (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.two_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_TWO
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.two_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessOutThree (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.three_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_THREE
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.three_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessOutFour (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.four_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_FOUR
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.four_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessOutFive (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.five_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_FIVE
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.five_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessOutSix (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.six_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_SIX
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.six_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessOutSeven (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.seven_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_SEVEN
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.seven_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessOutEight (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.eight_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_EIGHT
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.eight_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessOutNine (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.nine_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_NINE
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.nine_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessOutTen (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.ten_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_TEN
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.ten_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessOutEleven (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.eleven_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.OUT_ELEVEN
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.eleven_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessInOne (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.one_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.IN_ONE
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.one_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessInTwo (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.two_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.IN_TWO
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.two_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessInTen (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.ten_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size
      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.IN_TEN
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.ten_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessInThree (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.three_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size
      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.IN_THREE
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.three_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessInFour (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.four_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.IN_FOUR
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.four_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessInFive (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.five_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.IN_FIVE
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.five_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessInSix (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.six_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.IN_SIX
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.six_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessInSeven (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.seven_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.IN_SEVEN
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.seven_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessInEight (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.eight_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.IN_EIGHT
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.eight_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },
    replaceSucessInNine (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.nine_fileVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      temp.type = this.monitor_file_type.IN_NINE
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.nine_fileVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessOutContainerOne (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.containerInfos[res.idx].file_oneVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      if (res.idx === 0) {
        temp.type = this.monitor_file_type.OUT_CONTAINER_ONE
      } else {
        temp.type = this.monitor_file_type.OUT_CONTAINER_FIVE
      }
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.containerInfos[res.idx].file_oneVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessOutContainerTwo (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.containerInfos[res.idx].file_twoVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData

      if (res.idx === 0) {
        temp.type = this.monitor_file_type.OUT_CONTAINER_TWO
      } else {
        temp.type = this.monitor_file_type.OUT_CONTAINER_SIX
      }
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.containerInfos[res.idx].file_twoVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessOutContainerThree (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.containerInfos[res.idx].file_threeVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      if (res.idx === 0) {
        temp.type = this.monitor_file_type.OUT_CONTAINER_THREE
      } else {
        temp.type = this.monitor_file_type.OUT_CONTAINER_SEVEN
      }
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.containerInfos[res.idx].file_threeVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessOutContainerFour (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorOutVo.containerInfos[res.idx].file_fourVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      if (res.idx === 0) {
        temp.type = this.monitor_file_type.OUT_CONTAINER_FOUR
      } else {
        temp.type = this.monitor_file_type.OUT_CONTAINER_EIGHT
      }
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorOutVo.containerInfos[res.idx].file_fourVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessInContainerOne (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.containerInfos[res.idx].file_oneVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      if (res.idx === 0) {
        temp.type = this.monitor_file_type.IN_CONTAINER_ONE
      } else {
        temp.type = this.monitor_file_type.IN_CONTAINER_FIVE
      }
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.containerInfos[res.idx].file_oneVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessInContainerTwo (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.containerInfos[res.idx].file_twoVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      if (res.idx === 0) {
        temp.type = this.monitor_file_type.IN_CONTAINER_TWO
      } else {
        temp.type = this.monitor_file_type.IN_CONTAINER_SIX
      }
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.containerInfos[res.idx].file_twoVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessInContainerThree (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.containerInfos[res.idx].file_threeVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      if (res.idx === 0) {
        temp.type = this.monitor_file_type.IN_CONTAINER_THREE
      } else {
        temp.type = this.monitor_file_type.IN_CONTAINER_SEVEN
      }
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.containerInfos[res.idx].file_threeVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    replaceSucessInContainerFour (res) {
      const tempData = deepCopy(this.dataJson.tempJson.monitorInVo.containerInfos[res.idx].file_fourVo)
      tempData.url = res.response.data.url
      tempData.internal_url = res.response.data.internal_url
      tempData.file_name = res.response.data.fileName
      tempData.fileName = res.response.data.fileName
      tempData.file_size = res.response.data.file_size

      const temp = {}
      temp.file = tempData
      if (res.idx === 0) {
        temp.type = this.monitor_file_type.IN_CONTAINER_FOUR
      } else {
        temp.type = this.monitor_file_type.IN_CONTAINER_EIGHT
      }
      temp.monitor_id = this.dataJson.tempJson.id

      this.showLoading('正在保存，请稍后...')
      // 替换附件
      saveFileApi(temp).then((_data) => {
        this.$notify({
          title: '替换成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.dataJson.tempJson.monitorInVo.containerInfos[res.idx].file_fourVo = deepCopy(_data.data)
        // loading
      }, (_error) => {
        this.$notify({
          title: '替换失败',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.closeLoading()
      })
    },

    //  文件上传失败
    replaceError () {
      console.debug('文件上传失败')
      this.$notify({
        title: '上传错误',
        message: '文件上传发生错误！',
        type: 'error',
        duration: 0
      })
    },

    handlePreview (url) {
      const index = this.dataJson.tempJson.preview_data.findIndex(item => {
        return item.url === url
      })

      const { href } = this.$router.resolve({
        path: `/preview`,
        query: {
          id: this.dataJson.tempJson.id,
          type: 'monitor',
          index: index
        }
      })
      window.open(href, '_blank')
    },

    getMonitorFile () {
      // 查询逻辑
      const temp = {}
      temp.id = this.dataJson.tempJson.id
      getMonitorFileApi(temp).then(response => {
        this.dataJson.tempJson.preview_data = deepCopy(response.data.preview_data)
        this.popSettings.one.props.data = deepCopy(this.dataJson.tempJson.preview_data)
      }).finally(() => {
      })
    },
    // getPrevData () {
    //   // 查询逻辑
    //   this.settings.loading_prev = true
    //   getPrevApi(this.data).then(response => {
    //     this.dataJson.tempJson.prev_id = response.data.prev_id
    //   }).finally(() => {
    //     this.settings.loading_prev = false
    //   })
    // },
    // getNextData () {
    //   // 查询逻辑
    //   this.settings.loading_next = true
    //   getNextApi(this.data).then(response => {
    //     this.dataJson.tempJson.next_id = response.data.next_id
    //   }).finally(() => {
    //     this.settings.loading_next = false
    //   })
    // },
    // 车牌号, 可删除
    handleVehicleDialog () {
      // this.popSettings.four.visible = true
    },
    // 车牌号：关闭对话框：确定
    // handleVehicleCloseOk (val) {
    //   const tempData = deepCopy(this.dataJson.tempJson)
    //   tempData.vehicle_no = val.no
    //   tempData.vehicle_id = val.id
    //   tempData.vehicle_code = val.code

    //   this.showLoading('正在保存，请稍后...')
    //   saveVehicleApi(tempData)
    //     .then(
    //       _data => {
    //         this.$notify({
    //           title: '保存成功',
    //           message: '保存成功',
    //           type: 'success',
    //           duration: this.settings.duration
    //         })
    //         this.dataJson.tempJson.vehicle_no = val.no
    //         this.dataJson.tempJson.vehicle_id = val.id
    //         this.dataJson.tempJson.vehicle_code = val.code

    //         this.popSettings.four.visible = false
    //       },
    //       _error => {
    //         this.$notify({
    //           title: '保存失败',
    //           message: '保存失败',
    //           type: 'error',
    //           duration: this.settings.duration
    //         })
    //       }
    //     )
    //     .finally(() => {
    //       this.closeLoading()
    //     })
    // },
    // 车牌号：关闭对话框：取消
    // handleVehicleCloseCancel () {
    //   this.popSettings.four.visible = false
    // },

    // 司机
    // handleDriverDialog () {
    //   this.popSettings.five.visible = true
    // },
    // 司机：关闭对话框：确定
    // handleDriverCloseOk (val) {
    //   const tempData = deepCopy(this.dataJson.tempJson)
    //   tempData.driver_name = val.name
    //   tempData.driver_id = val.id
    //   tempData.driver_code = val.code

    //   this.showLoading('正在保存，请稍后...')
    //   saveDriverApi(tempData)
    //     .then(
    //       _data => {
    //         this.$notify({
    //           title: '保存成功',
    //           message: '保存成功',
    //           type: 'success',
    //           duration: this.settings.duration
    //         })
    //         this.dataJson.tempJson.driver_name = val.name
    //         this.dataJson.tempJson.driver_id = val.id
    //         this.dataJson.tempJson.driver_code = val.code

    //         this.popSettings.five.visible = false
    //       },
    //       _error => {
    //         this.$notify({
    //           title: '保存失败',
    //           message: '保存失败',
    //           type: 'error',
    //           duration: this.settings.duration
    //         })
    //       }
    //     )
    //     .finally(() => {
    //       this.closeLoading()
    //     })
    // },
    // // 司机：关闭对话框：取消
    // handleDriverCloseCancel () {
    //   this.popSettings.five.visible = false
    // },
    // 更新验车状态
    // saveValidatVehicle () {
    //   this.showLoading('正在保存，请稍后...')
    //   const tempData = deepCopy(this.dataJson.tempJson)
    //   tempData.validate_vehicle = this.dataJson.tempJson.validate_vehicle
    //   saveValidatVehicleApi(tempData).then((_data) => {
    //     this.$notify({
    //       title: '保存成功',
    //       message: '保存成功',
    //       type: 'success',
    //       duration: this.settings.duration
    //     })
    //   }, (_error) => {
    //     this.$notify({
    //       title: '保存失败',
    //       message: '保存失败',
    //       type: 'error',
    //       duration: this.settings.duration
    //     })
    //   }).finally(() => {
    //     this.closeLoading()
    //   })
    //   console.log('----------', this.dataJson.tempJson)
    // },
    // 基础信息修改
    handleBasicEdit () {
      this.popSettings.six.visible = true
    },
    // 基础信息修改取消
    handleBasicCloseCancel () {
      this.popSettings.six.visible = false
    },
    // 保存成功回调
    handleBasicCloseSuccess () {
      this.popSettings.six.visible = false
      this.getData()
    },
    // 作废按钮
    handleOutCancel () {
      this.popSettings.four.visible = true
      this.popSettings.four.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.four.props.data = { id: this.dataJson.tempJson.monitorOutVo.out_id, code: this.dataJson.tempJson.out_code, status_name: this.dataJson.tempJson.out_status_name }
      this.popSettings.four.visible = true
    },
    handleCloseDialogFourOk (val) {
      this.settings.loading = true
      // 作废
      // 设置到table中绑定的json数据源
      const selectionJson = []
      selectionJson.push({ 'id': this.dataJson.tempJson.monitorOutVo.out_id, 'remark': val.remark })

      this.showLoading('正在保存，请稍后...')
      // 开始作废
      cancelOutApi(selectionJson).then((_data) => {
        this.$notify({
          title: '作废成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.popSettings.four.visible = false
        this.getData()
        // loading
      }, (_error) => {
        this.$notify({
          title: '作废错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
      })
    },
    handleCloseDialogFourCancel () {
      this.popSettings.four.visible = false
    },

    // 作废按钮
    handleInCancel () {
      this.popSettings.five.visible = true
      this.popSettings.five.props.dialogStatus = this.PARAMETERS.STATUS_UPDATE
      this.popSettings.five.props.data = { id: this.dataJson.tempJson.monitorInVo.in_id, code: this.dataJson.tempJson.in_code, status_name: this.dataJson.tempJson.in_status_name }
      this.popSettings.five.visible = true
    },
    handleCloseDialogFiveOk (val) {
      this.settings.loading = true
      // 作废
      // 设置到table中绑定的json数据源
      const selectionJson = []
      selectionJson.push({ 'id': this.dataJson.tempJson.monitorInVo.in_id, 'remark': val.remark })

      this.showLoading('正在保存，请稍后...')
      // 开始作废
      cancelInApi(selectionJson).then((_data) => {
        this.$notify({
          title: '作废成功',
          message: _data.message,
          type: 'success',
          duration: this.settings.duration
        })
        this.popSettings.five.visible = false
        this.getData()
        // loading
      }, (_error) => {
        this.$notify({
          title: '作废错误',
          message: _error.message,
          type: 'error',
          duration: this.settings.duration
        })
      }).finally(() => {
        this.settings.loading = false
        this.closeLoading()
      })
    },
    handleCloseDialogFiveCancel () {
      this.popSettings.five.visible = false
    }

  }

}
</script>
