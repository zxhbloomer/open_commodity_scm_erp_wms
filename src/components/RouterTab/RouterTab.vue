<template>
  <div class="router-tab">
    <!-- 页签头部 -->
    <header :class="[ 'router-tab-header', hasScroller && 'is-scroll' ]">
      <div class="router-tab-scroll">
        <!-- 页签列表 -->
        <transition-group
          tag="ul"
          class="router-tab-nav"
          v-bind="getTransOpt(tabTransition)"
          @after-enter="onTabTransitionEnd"
          @after-leave="onTabTransitionEnd"
        >
          <router-link
            v-for="({ id, to, title, icon, tips, closable }, index) in items"
            :key="id || to"
            class="router-tab-item"
            tag="li"
            :class="{ actived: activeTabId === id, contextmenu: contextmenu.id === id }"
            :title="i18nText(tips || title) || lang.tab.untitled"
            :to="to"
            @contextmenu.native.prevent="e => showContextmenu(id, index, e)"
            @click.native="clickRouter(items[index])"
          >{{ i18nText(tips || title) || lang.tab.untitled }}
            <slot v-bind="{ tab: items[index], tabs: items, index }">
              <i
                v-if="icon"
                class="tab-icon"
                :class="icon"
              />
              <i
                v-if="(closable !== false && !(keepLastTab && items.length < 2)) && (isEmptyAndRtnDefaultValue(items[index].affix,false)===false)"
                class="el-icon-close"
                :title="lang.contextmenu.close"
                @click.prevent="closeTab(id)"
              />
            </slot>
          </router-link>
        </transition-group>
      </div>

      <!-- 页签滚动 -->
      <a
        class="nav-prev"
        @click="tabScroll('left')"
      />
      <a
        class="nav-next"
        @click="tabScroll('right')"
      />
    </header>

    <!-- 页面容器 -->
    <div
      class="router-tab-container"
      :class="{ loading }"
    >
      <!-- 路由页面 -->
      <router-alive
        ref="routerAlive"
        :alive-id="aliveId"
        @update="updateTab"
      >
        <transition
          v-bind="getTransOpt(pageTransition)"
          appear
          @after-enter="onPageTransitionEnd"
          @after-leave="onPageTransitionEnd"
        >
          <router-view
            v-if="isViewAlive"
            ref="routerView"
            v-bind="routerView"
            class="router-tab-page"
          />
        </transition>
      </router-alive>

      <!-- iframe 页面 -->
      <transition-group
        v-bind="getTransOpt(pageTransition)"
        tag="div"
        class="router-tab-iframes"
      >
        <iframe
          v-for="url in iframes"
          v-show="url === currentIframe"
          :key="url"
          :src="url"
          :name="iframeNamePrefix + url"
          frameborder="0"
          class="router-tab-iframe"
          @load="iframeLoaded(url)"
        />
      </transition-group>
    </div>

    <!-- 右键菜单 -->
    <transition name="router-tab-zoom">
      <div
        v-if="contextmenu.id"
        class="router-tab-contextmenu"
        :style="`left: ${contextmenu.left}px; top: ${contextmenu.top}px;`"
      >
        <a
          class="contextmenu-item"
          :disabled="!isContextTabActived"
          @click="isContextTabActived && refreshTab(contextmenu.id)"
        >
          {{ lang.contextmenu.refresh }}
        </a>

        <a
          class="contextmenu-item"
          :disabled="items.length < 2"
          @click="items.length > 1 && refreshAll()"
        >
          {{ lang.contextmenu.refreshAll }}
        </a>

        <a
          class="contextmenu-item"
          :disabled="!isContextTabCanBeClosed"
          @click="isContextTabCanBeClosed && closeTab(contextmenu.id)"
        >
          {{ lang.contextmenu.close }}
        </a>

        <a
          class="contextmenu-item"
          :disabled="!tabsLeft.length"
          @click="tabsLeft.length && closeMulti(tabsLeft)"
        >
          {{ lang.contextmenu.closeLefts }}
        </a>

        <a
          class="contextmenu-item"
          :disabled="!tabsRight.length"
          @click="tabsRight.length && closeMulti(tabsRight)"
        >
          {{ lang.contextmenu.closeRights }}
        </a>

        <a
          class="contextmenu-item"
          :disabled="!tabsOther.length"
          @click="tabsOther.length && closeMulti(tabsOther)"
        >
          {{ lang.contextmenu.closeOthers }}
        </a>
      </div>
    </transition>
  </div>
</template>

<script src="./index.js"></script>

<style lang="scss" src="./scss/routerTab.scss"></style>
<style lang="scss" src="./scss/transition.scss"></style>

<style lang="scss">
//reset element css of el-icon-close
.router-tab-nav {
  .router-tab-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
