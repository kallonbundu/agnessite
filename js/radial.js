let nav = document.querySelector('.nav');
let links = document.querySelector('.container-list');
let off_on = true;
let bar_icon = document.querySelector('.bar-icon');
bar_icon.addEventListener('click', function(){
	this.classList.toggle('active');
	if(off_on == true) {
		links.style.overflow = 'hidden';
		links.style.width = '100%';
		links.style.transition = '0.5s';
		nav.style.background = '#f1f4df';
		nav.style.transition = '0.5s';
		off_on =  false;
	} else {
		off_on = true;
		links.style.width = '0%';
		links.style.overflow = 'hidden';
		links.style.transition = '0.5s';
		nav.style.background = 'transparent';
		nav.style.transition = '0.5s';
	}
})

const slider = (function(){
	const slider = document.getElementById("slider");
	const sliderPhotos = document.querySelector(".slider-photos");
	const sliderWrapper = document.querySelector(".slider-photos-wrapper");
	const items = document.querySelectorAll(".slider-item");
	const sliderPhotosControls = createHTMLElement("div", "slider-content__controls");
	let prevButton = null;
	let nextButton = null;
	let autoButton = null;
	let intervalId = null;
	const itemsInfo = {
		position: {
			current: 0,
			min: 0,
			max: items.length - 1 
		},
		intervalSpeed: 2000,
		update: function(value) {
			this.position.current = value;
			this.offset = -value;
		}
	};
	const controlsInfo = {};
	function init(props) {
		let {intervalSpeed, position} = itemsInfo;
		if (slider && sliderPhotos && sliderWrapper && items) {
			if (props && props.intervalSpeed) {
				intervalSpeed = props.intervalSpeed;
			}
			if (props && props.currentItem) {
				if ( parseInt(props.currentItem) >= position.min && parseInt(props.currentItem) <= position.max ) {
					position.current = props.currentItem;
				}
			}
			if (props && props.buttons) {
				controlsInfo.buttonsEnabled = true;
			}
			updateControlsInfo();
			createControls(controlsInfo, controlsInfo.buttonsEnabled);
			render();	
		}
	}
	function updateControlsInfo() {
		const {current, min, max} = itemsInfo.position;
		controlsInfo.prevButtonDisabled = current > min ? false : true;
		controlsInfo.nextButtonDisabled = current < max ? false : true;
	}
	function createControls(buttons = false) {
		sliderPhotos.append(sliderPhotosControls);
		createArrows();
		buttons ? createButtons() : null;
		function createArrows() {
			leftArrow = createHTMLElement("div", "prev-arrow");		
			rightArrow = createHTMLElement("div", "next-arrow");
			sliderPhotosControls.append(leftArrow, rightArrow);
		}
		function createButtons() {
			const controlsWrapper = createHTMLElement("div", "slider-controls");
			prevButton = createHTMLElement("button", "prev-control", "Prev");
			prevButton.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current - 1))
			autoButton = createHTMLElement("button", "auto-control", "Auto");
			autoButton.addEventListener("click", () => {
				intervalId = setInterval(function(){
					if (itemsInfo.position.current < itemsInfo.position.max) {
						itemsInfo.update(itemsInfo.position.current + 1);
					}
					slideItem();
				}, itemsInfo.intervalSpeed)
			})
			nextButton = createHTMLElement("button", "next-control", "Next");
			nextButton.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current + 1))
			controlsWrapper.append(prevButton, autoButton, nextButton);
			slider.append(controlsWrapper);
		}
	}
	function setClass(options) {
		if (options) {
			options.forEach(({element, className, disabled}) => {
				if (element) {
					disabled ? element.classList.add(className) : element.classList.remove(className)	
				}
			})
		}
	}
	function updateItemsInfo(value) {
		itemsInfo.update(value);
		slideItem(true);	
	}
	function render() {
		const {prevButtonDisabled, nextButtonDisabled} = controlsInfo;
		let controlsArray = [
			{element: leftArrow},
			{element: rightArrow}
		];
		if (controlsInfo.buttonsEnabled) {
			controlsArray = [
				...controlsArray, 
				{element:prevButton, className: "disabled", disabled: prevButtonDisabled},
				{element:nextButton, className: "disabled", disabled: nextButtonDisabled}
			];
		}
		setClass(controlsArray);
		sliderWrapper.style.transform = `translateX(${itemsInfo.offset*100}%)`;	
	}
	function slideItem() {
		updateControlsInfo();
		render();
	}
	function createHTMLElement(tagName="div", className, innerHTML) {
		const element = document.createElement(tagName);
		className ? element.className = className : null;
		innerHTML ? element.innerHTML = innerHTML : null;
		return element;
	}
	return {init};
}())
slider.init({
	currentItem: 0,
	buttons: true
});