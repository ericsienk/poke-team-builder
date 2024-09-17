import { Component } from '@angular/core';
import LegendsArceusDex from '../assets/legends-arceus-dex.json';
import NationalDex from '../assets/national-dex.json';
import ScarletVioletDex from '../assets/scarlet-violet-dex.json';
import VioletDlcDex from '../assets/violet-dlc-dex.json';
import DiamondPearlDex from '../assets/diamond-pearl-dex.json';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
const HP = 'hp',
  ATTACK = 'atk',
  DEFENSE = 'def',
  SPECIAL_ATK = 'spa',
  SPECIAL_DEF = 'spd',
  SPEED = 'spe';

const STATS = [HP, ATTACK, DEFENSE, SPECIAL_ATK, SPECIAL_DEF, SPEED];

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
  filterPokemonRequired: Observable<any>;
  filterPokemonBanned: Observable<any>;
  builtTeam: any[] = [];
  iterations = 10000;
  banList: any[] = [];
  loading = false;
  error: boolean | string = false;
  currentIteration = 0;
  requestedIterations = 0;
  baseSpriteUrlMapper: any = {
    'Scarlet & Violet': 'https://img.pokemondb.net/sprites/scarlet-violet/normal',
    'Violet DLC': 'https://img.pokemondb.net/sprites/scarlet-violet/normal',
    'Legends of Arceus': 'https://img.pokemondb.net/sprites/legends-arceus/normal',
    'Diamond & Pearl': 'https://img.pokemondb.net/sprites/bank/normal',
    'National': 'https://img.pokemondb.net/sprites/home/normal',
  };
  baseSpriteUrl: string = this.baseSpriteUrlMapper['Scarlet & Violet'];

  constructor(private fb: FormBuilder) {
    this.dexList = [
      { name: 'Scarlet & Violet', value: this.filterPokdex(ScarletVioletDex) },
      { name: 'Violet DLC', value: this.filterPokdex(VioletDlcDex) },
      { name: 'Legends of Arceus', value: this.filterPokdex(LegendsArceusDex) },
      { name: 'Diamond & Pearl', value: this.filterPokdex(DiamondPearlDex) },
      { name: 'National', value: this.filterPokdex(NationalDex) },
    ];
    this.dex = this.dexList[0].value;
    this.teamForm = new FormGroup({
      pokedex: new FormControl(),
      members: new FormArray([]),
      iterations: new FormControl(),
      banned: new FormArray([]),
    });

    this.resetMembers();
    this.resetBanned();
    this.pokedex.setValue(this.dexList[0].value);

    this.filterPokemonRequired = this.members.valueChanges
      .pipe(
        startWith([{ member: "" }]),
        map(values => values.map((value: any) => typeof value === 'string' ? value : value.member)),
        map(values => values.map((name: any) => name ? this._filterPokemonRequired(name) : this.dex))
      );

      this.filterPokemonBanned = this.banned.valueChanges
      .pipe(
        startWith([{ member: "" }]),
        map(values => values.map((value: any) => typeof value === 'string' ? value : value.member)),
        map(values => values.map((name: any) => name ? this._filterPokemonRequired(name) : this.dex))
      );
    
    if (typeof Worker === 'undefined') {
      alert('Hey your browser is too old for this webpage!');
    }
  }

  resetMembers() {
    this.members.clear();
    new Array<any>(6).fill(true).forEach((item, index) => {
      this.members.push(new FormGroup({ member: new FormControl('') }));
    })
  }

  resetBanned() {
    while (this.banned.length) {
      this.banned.removeAt(0);
    }
    this.banned.push(new FormGroup({ member: new FormControl('') }));
  }

  get banned(): FormArray {
    return this.teamForm.get("banned") as FormArray;
  }

  get members(): FormArray {
    return this.teamForm.get("members") as FormArray;
  }

  get pokedex(): FormControl {
    return this.teamForm.get("pokedex") as FormControl;
  }

  filterPokdex(pokedex: any) {
    return pokedex.filter((x: any) => {
      if (!x.oob || !x.oob.evos.length && x.oob.dex_number > 0) {
        let total = this._getTotalStats(x);
        if (total <= 601) {
          return true;
        }
      }
      return false;
    });
  }

  _getTotalStats(statsObject: any) {
    return STATS.reduce((total, stat) => total + statsObject[stat], 0);
  }

  onSubmit() {
    this.loading = true;
    this.error = false;
    this.requestedIterations = this.iterations;
    this.worker = new Worker(new URL('./app.worker', import.meta.url));
    this.worker.onmessage = ({ data }: any) => {
      this.builtTeam = data.team;
      this.currentIteration = data.currentInteration;
      if (data.done) {
        this.loading = false;
        this.worker.terminate();
      }
    };

    this.worker.onerror = (e: Error) => {
      this.error = e?.message || 'Something went wrong...';
      this.loading = false;
    }    

    this.members.controls.forEach((control) => {
      if (control.value.member.length) {
        control.reset();
      }
    });
    console.log(this.teamForm.value);

    const team = this.members.controls.filter((group) => group.value.member?.name).map((control) => control.value.member.name);
    console.log(team);
    const payload = { pokemon: this.dex, team, banList: this.banList, iterations: Math.max(this.iterations, 1) };
    console.log(payload);
    this.worker.postMessage(payload);
  }

  selectedDex() {
    this.resetMembers();
    this.resetBanned();
    const { name } = this.dexList.find(({ value }) => value === this.dex);
    this.baseSpriteUrl = this.baseSpriteUrlMapper[name];
    this.builtTeam = [];
  }

  memberBlur(event: any) {
    console.log(event);
  }

  addToBanList(member: any) {
    console.log(member);
    this.banList.push(member.name);
    this.resetBanned();
  }

  removeFromBanList(index: any) {
    this.banList.splice(index, 1);
  }

  private _filterPokemonRequired(name: string) {
    if (typeof name !== 'string') return [];
    const _filterValue = name.toLowerCase();
    return this.dex.filter((d: any) => d.name.toLowerCase().includes(_filterValue));
  }

  public displayFn(obj: any): string {
    return obj ? obj.name : '';
  }

  public getSpriteUrl(member: any) {
    const name = member.name.toLowerCase().replace(' ', '').replace('.', '-');
    return `${this.baseSpriteUrl}/${name + (member.tag ? member.tag : '')}.png`
  }

  public getSearchUrl(member: any) {
    return `https://www.google.com/search?q=${encodeURIComponent(member.name)}+smogon+serebii`;
  }
}