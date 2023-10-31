<template>
    <div class="cm__popup" :class="[`__${data.style}`, hidden ? 'showhidden' : '']" v-show="show">
        <div class="cm__popup__inner">
            <button @click="apply()" class="cm__close" type="button"></button>

            <div v-if="!hidden" class="cm__popup__inner-main">
                <div class="cm__popup__inner-content" v-html="data.main_content"></div>
                <div class="cm__popup__inner-nav">
                    <button v-if="data.hidden_content.length" @click="this.hidden = !this.hidden" class="cm__link"
                        type="button">More options</button>
                    <button @click="all(false)" class="cm__button cm__button_secondary" type="button">Reject All</button>
                    <button @click="all(true)" class="cm__button" type="button">Accept All</button>
                </div>
            </div>
            <div v-show="hidden" class="cm__popup__inner-hidden">
                <div class="cm__popup__inner-content" v-html="fieldsParse(data.hidden_content)"></div>

                <div class="teleports" v-if="isMounted">
                    <teleport v-for="(teleport, x) of teleports" :to="`#${teleport}`" :key="x">
                        <field :consent="data.cookie[teleport.split('-')[1]]" :color="colorBase" />
                    </teleport>
                </div>
                <div class="cm__popup__inner-nav">
                    <button @click="apply()" class="cm__button" type="button">Save preferences</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import jsonDataDefault from "./cookies-manage-option.json";
import Cookie from 'js-cookie';
import Field from './Field.vue'

export default {
    name: 'CookieManagePopupVue',
    props: {
        extData: {
            type: [Object, Boolean],
            default: false
        },
        extShow: {
            type: Boolean
        }
    },
    components: {
        field: Field
    },
    data() {
        return {
            show: false,
            data: {},
            cookiesManager: null,
            hidden: false,
            teleports: [],
            isMounted: false,
            colorBase: false,
            colorSecondary: false,
        }
    },
    watch: {
        extShow: function () {
            this.show = this.extShow;
        },
        show: function () {
            if (this.data.style === 'bottom') return;

            document.body.style.overflow = this.show ? 'hidden' : 'auto';
        },
    },
    methods: {
        initData(options) {
            this.data = Object.assign(jsonDataDefault, options || {})

            this.colorBase = this.data?.color?.base || '#222';
            this.colorSecondary = this.data?.color?.secondary || '#222';
            this.cookiesManager = Cookie.withAttributes(this.data?.cookieConfig?.options || {})
        },
        fieldsParse(text) {
            const fields = text.match(/\[([^\]]+)\]/g)?.map(match => match.slice(1, -1));

            if (fields && fields.length) {
                fields.forEach(field => {

                    if (this.teleports.indexOf(field) === -1) {
                        this.teleports.push(field);
                    }

                    text = text.replace(`[${field}]`, `<div id="${field}"></div>`);
                });
            }

            return text;
        },
        getConsent() {
            let concent = [];

            this.data.cookie.forEach(item => {
                item.name.forEach(name => {
                    concent.push({
                        name: name,
                        value: Cookie.get(name) === '1' ? 'granted' : 'denied'
                    })
                })
            })

            return concent;
        },
        apply() {
            this.show = false;

            this.cookiesManager?.set(this.data.cookieConfig.name, this.data.cookieConfig.value);

            if (typeof window.ga === 'function') {
                window.dataLayer.push('consent', 'update', this.getConsent());
            }

        },
        all(res = true) {

            for (let index = 0; index < this.data.cookie.length; index++) {

                if (typeof this.data.cookie[index].required === 'undefined') {
                    this.data.cookie[index].name.forEach(name => {
                        Cookie.set(name, res ? 1 : 0);
                    })

                    this.data.cookie[index]['enabled'] = res ? 'on' : false;
                }

            }

            this.apply();
        },

        reject() {
            this.apply();
        }
    },
    beforeMount() {
        this.initData((this.extData ? this.extData : {}))
    },
    mounted() {

        if (this.cookiesManager?.get(this.data?.cookieConfig?.name) != this.data?.cookieConfig?.value) {
            this.show = true;
        }

        this.isMounted = true;

        if (typeof ga === 'function') {
            window.dataLayer.push('consent', 'default', this.getConsent());

            window.dataLayer.push({
                'event': 'default_consent'
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.cm {
    &__popup {
        position: fixed;
        z-index: 10;

        @media (max-width: 640px) {
            height: 100%;
            display: flex;
            align-items: flex-end;
        }

        &.__popup {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(#000, .8);
            transition: opacity .2s linear;
            overflow: auto;
            padding: 20px;

            @media (max-width: 576px) {
                padding: 0;
            }

            &.showhidden {
                display: block;

                @media (max-height: 750px) {
                    height: 100%;
                }
            }
        }

        &.__popup & {
            &__inner {
                padding: 80px 97px;
                width: 100%;
                max-width: 940px;
                margin: 0 auto;

                @media (max-width: 820px) {
                    padding: 80px 20px;
                }

                @media (max-width: 576px) {
                    padding: 40px 20px;
                }

                &-nav {
                    padding-top: 40px;
                    text-align: right;

                    button {
                        &:not(:last-child) {
                            margin-right: 24px;

                            @media (max-width: 576px) {
                                margin-right: 0;
                                margin-bottom: 15px;
                            }
                        }
                    }
                }
            }
        }

        &.__bottom {
            left: 0;
            bottom: 0;
            width: 100%;

            &.showhidden {
                @media (max-height: 650px) {
                    display: block;
                    height: 100%;
                }

                @media (max-width: 920px) {
                    display: block;
                    height: 100%;
                }
            }

            .cm__close {
                top: 10px;

                @media (max-width: 640px) {
                    top: 20px;
                }
            }
        }

        &.__bottom & {
            &__inner {
                padding-top: 40px;
                padding-bottom: 20px;

                &-main,
                &-hidden {
                    padding: 0 30px;
                    margin: 0 auto;

                    @media (max-width: 640px) {
                        padding: 0 15px;
                    }
                }

                &-main {
                    display: flex;

                    @media (max-width: 640px) {
                        display: block;
                    }

                    .cm__popup__inner-nav {
                        padding-left: 40px;

                        @media (max-width: 640px) {
                            padding-left: 0;
                            padding-top: 30px;
                        }
                    }
                }

                &-nav {
                    display: flex;
                    flex-direction: column-reverse;
                    justify-content: flex-end;
                    flex-shrink: 0;
                    gap: 10px;
                }
            }
        }

        &__inner {
            background-color: #fff;
            transition: translate .1s linear;
            position: relative;

            &.show {
                translate: 0;
            }

            &-content {
                *:first-child {
                    margin-top: 0;
                    padding-top: 0;
                }

                h2 {
                    font-size: 30px;
                    line-height: 40px;
                    margin-bottom: 15px;
                }

                a {
                    text-decoration: underline;
                    text-decoration-color: v-bind(colorBase);
                }

                b {
                    font-weight: 500;
                }

                p {
                    margin: 0;

                    &:not(:last-child) {
                        margin-bottom: 10px;
                    }
                }
            }

            &-nav {
                @media (max-width: 640px) {
                    display: flex;
                    flex-direction: column-reverse;
                    justify-content: flex-end;
                    flex-shrink: 0;
                    gap: 10px;
                }
            }
        }
    }

    &__close, &__link, &__button {
        cursor: pointer;
    }

    &__link, &__button {
        font-size: 16px;
    }

    &__button {
        background-color: v-bind(colorBase);
        padding: 12px 32px;
        display: inline-block;
        text-align: center;
        transition: color .1s linear;
        position: relative;
        border: 2px solid transparent;
        margin: 2px;
        max-width: calc(100% - 4px);
        color: #fff;

        &.cm__button_secondary {
            background-color: v-bind(colorSecondary);
        }
    }

    &__close {
        border: none;
        background-color: transparent;
        position: absolute;
        top: 30px;
        right: 30px;
        height: 20px;
        width: 20px;
        padding: 0;
        margin: 0;

        @media (max-width: 820px) {
            top: 15px;
            right: 15px;
        }

        &:before,
        &:after {
            content: "";
            width: 20px;
            height: 2px;
            background-color: #000;
            position: absolute;
            top: calc(50% - 1px);
            left: 0;
        }

        &:before {
            rotate: 45deg;
        }

        &:after {
            rotate: -45deg
        }
    }

    &__link {
        outline: none;
        background-color: transparent;
        border: none;
        text-decoration: underline;
        text-decoration-color: v-bind(colorBase);
    }
}
</style>
