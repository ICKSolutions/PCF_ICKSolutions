import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class ProbabilityRatingControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;

	private _slider: HTMLInputElement;
	private _ratingQualificationDiv: HTMLDivElement;

	private _sliderOnChange: EventListenerOrEventListenerObject;
	private _sliderOnInput: EventListenerOrEventListenerObject;

	private _value: number;

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._container = container;
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		this._value = 0;

		if (context.parameters.probabilityrating == null) {
			this._value = 0;
		} else {
			this._value = context.parameters.probabilityrating.raw == null ? 0 : context.parameters.probabilityrating.raw;
		}
		debugger;

		this._sliderOnChange = this.sliderOnChange.bind(this);
		this._sliderOnInput = this.sliderOnInput.bind(this);
		this.renderProbabilityValue.bind(this);

		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = "0";
		slider.max = "100";
		slider.value = String(this._value);
		slider.classList.add("slider");
		slider.addEventListener("change", this._sliderOnChange);
		slider.addEventListener("input", this._sliderOnInput);

		let ProbabilityClass = document.createElement("div");
		ProbabilityClass.classList.add("probability-class");

		let ratingQualificationDiv = document.createElement("div");
		ProbabilityClass.appendChild(ratingQualificationDiv);
		container.appendChild(ProbabilityClass)

		this._ratingQualificationDiv = ratingQualificationDiv;
		this._slider = slider;

		container.appendChild(slider);
		container.appendChild(ProbabilityClass);

		this.renderProbabilityValue(this._value);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			probabilityrating: this._value
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}

	public sliderOnChange(): void {
		this._value = +this._slider.value;
		this._notifyOutputChanged();
	}

	public sliderOnInput(): void {
		let sliderValue = +this._slider.value;
		this.renderProbabilityValue(sliderValue);
	}

	public renderProbabilityValue(ProbabilityValue: number): void {
		if (ProbabilityValue >= 0 && ProbabilityValue <= 30) {
			this._ratingQualificationDiv.className = "moreten-probabilityrating";
		} else if (ProbabilityValue > 30 && ProbabilityValue <= 40) {
			this._ratingQualificationDiv.className = "morethirty-probabilityrating";
		} else if (ProbabilityValue > 40 && ProbabilityValue <= 60) {
			this._ratingQualificationDiv.className = "moreforty-probabilityrating";
		} else if (ProbabilityValue > 60 && ProbabilityValue <= 80) {
			this._ratingQualificationDiv.className = "moresixty-probabilityrating";
		} else if (ProbabilityValue > 80 && ProbabilityValue <= 100) {
			this._ratingQualificationDiv.className = "moreeighty-probabilityrating";
		}
		this._ratingQualificationDiv.style.width = ProbabilityValue + "%";
		this._ratingQualificationDiv.innerHTML = " " + ProbabilityValue;
	}
}