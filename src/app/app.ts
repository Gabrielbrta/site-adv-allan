import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  
  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.router.routerState.root;
      while (route.firstChild) {
        route = route.firstChild;
      }

      const metaDescription = route.snapshot.data['metaDescription'];
      if (metaDescription) {
        this.metaService.updateTag({ 
          name: 'description', 
          content: metaDescription 
        });
      } else {
        this.metaService.updateTag({ 
          name: 'description', 
          content: 'Allan Rodrigues Advocacia - Soluções jurídicas em Santos e todo o Brasil.' 
        });
      }
    });
  }
}