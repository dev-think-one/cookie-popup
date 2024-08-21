<template>
    <div class="cm__popup__field">
        <div @click="toggle()" class="cm__popup__checkbox" :class="{
            'enabled': checked || consent.required,
            'disabled': consent.required
        }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="#fff"
                    d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
            </svg>
        </div>
        <div class="cm__popup__field-content">
            <strong class="cm__popup__field-label" @click="show = !show">
                {{ consent.title }}
                <button>
                    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.44141 7.21484L1.19141 1.96484C0.917969 1.71875 0.917969 1.30859 1.19141 1.03516C1.4375 0.789062 1.84766 0.789062 2.12109 1.03516L6.90625 5.84766L11.6914 1.0625C11.9375 0.789062 12.3477 0.789062 12.6211 1.0625C12.8672 1.30859 12.8672 1.71875 12.6211 1.96484L7.34375 7.21484C7.09766 7.48828 6.6875 7.48828 6.44141 7.21484Z"
                            fill="#000" />
                    </svg>
                </button>
            </strong>
            <div :class="['cm__popup__field-description', !show || 'show']">
                <p>{{ consent.description }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import Cookie from 'js-cookie';

export default {
    name: 'FieldTemplate',
    data() {
        return {
            checked: false,
            show: false,
        }
    },
    props: {
        consent: Object,
        color: String
    },
    watch: {
        'consent.enabled': function () {
            this.checkboxData();
        }
    },
    methods: {
        toggle() {
            if (this.consent.required) return;

            this.checked = !this.checked;

            this.consent.name.forEach(name => {
                Cookie.set(name, this.checked ? 1 : 0);
            });

        },
        checkboxData() {
            const cookie = Cookie.get(this.consent.name[0]);

            if (cookie) {
                if (cookie === '1') {
                    this.checked = true;
                } else if (cookie === '0') {
                    this.checked = false;
                }

                return;
            }

            this.consent.name.forEach(name => {
                this.checked = this.consent.enabled === 'on' ? true : false;
                Cookie.set(name, this.checked ? 1 : 0);
            });
        },
    },
    mounted() {
        this.checkboxData();
    }
}
</script>

<style lang="scss" scoped>
.cm {
    &__popup {
        &__checkbox {
            display: block;
            height: 28px;
            width: 28px;
            position: relative;
            cursor: pointer;
            background-color: #fff;
            border: 2px solid #b3b5b9;
            border-radius: 4px;

            svg {
                position: absolute;
                display: none;
                position: absolute;
                top: 50%;
                left: 50%;
                translate: -50% -50%;
            }

            &.enabled {
                background-color: v-bind('color');
                border-color: v-bind('color');

                svg {
                    display: block;
                }
            }

            &.disabled {
                background-color: #b3b5b9;
                border-color: #b3b5b9;
                cursor: default;
            }
        }

        &__field {
            display: flex;
            margin-bottom: 30px;

            &-label {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;

                button {
                    width: 14px;
                    background-color: transparent;
                    border: none;
                    outline: none;
                    padding: 0;
                    margin: 0;

                    svg {
                        max-width: 100%;
                    }
                }
            }

            &-description {
                max-height: 0;
                overflow: hidden;

                &.show {
                    max-height: 100%;
                }
            }
        }

        &__field & {
            &__checkbox {
                flex-shrink: 0;
                margin-right: 16px;
            }
        }
    }
}
</style>