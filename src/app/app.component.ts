import { Component } from '@angular/core';
import LegendsArceusDex from '../assets/legends-arceus-dex.json';
import NationalDex from '../assets/national-dex.json';
import { FormGroup, FormControl,FormArray, FormBuilder } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Team Builder';

  dexList: any[];

  dex: any;

  team: any[] = new Array<any>(6).fill(true).map(() => ({}));

  worker: any;

  teamForm: FormGroup;

  public filterPokemon: Observable<any>;

  builtTeam: any[] = [];

  constructor(private fb: FormBuilder) {
    this.dexList =  [
      { name: 'Legends of Arceus', value: LegendsArceusDex },
      { name: 'National', value: NationalDex },
    ];
    this.dex = this.dexList[0].value;
    this.teamForm = new FormGroup({ pokedex: new FormControl(), members: new FormArray([]) });
    
    this.resetMembers();
    this.pokedex.setValue(this.dexList[0].value);
          
   this.filterPokemon = this.members.valueChanges
     .pipe(
       startWith([{ member: "" }]),
       map(values => values.map((value: any) => typeof value === 'string' ? value : value.member)),
       map(values => values.map((name: any) => name ? this._filterPokemon(name) : this.dex)),
    );
    
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker(new URL('./app.worker', import.meta.url));
      this.worker.onmessage = ({data}: any, more: any) => {
        this.builtTeam = data.team;
      };
    } else {
      alert('Hey your browser is too old for this webpage!');
    }
  }

  resetMembers() {
    this.members.clear();
    new Array<any>(6).fill(true).forEach((item, index) => {
      this.members.push(new FormGroup({ member: new FormControl('') }));
    })
  }

  get members() : FormArray {
    return this.teamForm.get("members") as FormArray;
  }

  get pokedex(): FormArray {
    return this.teamForm.get("pokedex") as FormArray;
  }

  onSubmit() {
    this.members.controls.forEach((control) => {
      if (control.value.member.length) {
        control.reset();
      }
    });
    console.log(this.teamForm.value);
    const team = this.members.controls.filter((group) => group.value.member?.name).map((control) => control.value.member.name);
    console.log(team);
    const payload = { pokemon: this.dex, team };
    console.log(payload);
    this.worker.postMessage(payload);
  }

  selectedDex(event: any) {
    this.resetMembers();
  }

  memberBlur(event: any) {
    console.log(event);

  }

  private _filterPokemon(name: string) {
    if(typeof name !=='string') return [];
    const _filterValue = name.toLowerCase();
    return this.dex.filter((d: any) => d.name.toLowerCase().includes(_filterValue));
  }

  public displayFn(obj: any): string {
    return obj ? obj.name : '';
  }
}