import { createApp } from 'vue';
import CookieManagePopupVue from './Popup.vue';

export class CookieManagePopup {
	
	constructor(mountTarget) {
		this.popup = createApp(CookieManagePopupVue).mount(mountTarget);
	}

	accessible(byTargetLink = 'cookiemanageshow') {
		const links = document.querySelectorAll(`a[href="#${byTargetLink}"]`);

		if (links.length) {
			links.forEach((link) => {
				link.addEventListener('click', (e) => {
					e.preventDefault();
					this.popup.show = true;
				});
			});
		}
	}

	useOption(option = {}) {
		this.popup.data = option;
	}
}

export default CookieManagePopupVue;