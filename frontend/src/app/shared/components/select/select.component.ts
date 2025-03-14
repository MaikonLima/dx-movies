import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() options: { value: any; label: string }[] = [];
  @Input() selectedValue: any;
  @Output() selectedValueChange = new EventEmitter<any>();

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedValue = selectElement.value;
    this.selectedValueChange.emit(this.selectedValue);
  }
}
