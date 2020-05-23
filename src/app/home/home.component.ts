import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  fs: any;
  robot: any;

  constructor(
    private router: Router,
    private electronService: ElectronService) { }

  ngOnInit() {
    this.fs = this.electronService.remote.require('fs');
    // this.robot = this.electronService.remote.require('robotjs');
  }

}
