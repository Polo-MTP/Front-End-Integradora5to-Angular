import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-home-admin',
  imports: [CardModule, ChartModule],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.css',
})
export class HomeAdmin implements OnInit {
  chartData: any;
  chartOptions: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.adminService.getDataDashboard().subscribe({
      next: (res) => {
        const labels = res.data.map(
          (item: any) => `Mes ${item.month}-${item.year}`
        );
        const counts = res.data.map((item: any) => item.count);

        this.chartData = {
          labels: labels,
          datasets: [
            {
              label: 'Peceras Registradas',
              backgroundColor: 'rgba(59,130,246)',
              borderColor: 'rgba(75, 192, 192, 1)',
              data: counts,
              fill: true,
            },
          ],
        };

        this.chartOptions = {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Peceras Registradas por Mes' },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Cantidad' },
            },
            x: { title: { display: true, text: 'Mes' } },
          },
        };
      },
      error: (err) => {
        console.error('Error loading data:', err);
      },
    });
  }
}
