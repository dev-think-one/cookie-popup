<template>
    <div class="cm__popup__field">
        <div @click="toggle()" class="cm__popup__checkbox"
            :class="[checked ? 'enabled' : '', consent.required ? 'disabled' : '',]">
            <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                <path fill="#fff"
                    d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
            </svg>
        </div>
        <div class="cm__popup__field-content">
            <strong>{{ consent.title }}</strong>
            <p>{{ consent.description }}</p>
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

            if (cookie === '1') {
                this.checked = true;
            } else if (cookie === '0') {
                this.checked = false;
            } else {
                this.consent.name.forEach(name => {
                    this.checked = this.consent.enabled === 'on' ? true : false;
                    Cookie.set(name, this.checked ? 1 : 0);
                });
            }
        }
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