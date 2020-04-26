import * as React from 'react';
import './ExtKommersantCovidWidget.scss';
import { separateThousands } from './utils/values';
import { getLocaleDate, getLocaleTime } from './utils/date';

interface ICovidStats {
    Date: string;
    CreatedAt: string;
    UpdatedAt: string | null;
    WorldInfected: number;
    WorldInfectedDiff: number;
    WorldDead: number;
    WorldDeadDiff: number;
    WorldRecovered: number;
    WorldRecoveredDiff: number;
    RussiaInfected: number;
    RussiaInfectedDiff: number;
    RussiaDead: number;
    RussiaDeadDiff: number;
    RussiaRecovered: number;
    RussiaRecoveredDiff: number;
    MoscowInfected: number;
    MoscowInfectedDiff: number;
    MoscowDead: number;
    MoscowDeadDiff: number;
    MoscowRecovered: number;
    MoscowRecoveredDiff: number;
}

interface ICovidArealStats {
    Infected: number;
    InfectedDiff: number;
    Dead: number;
    DeadDiff: number;
    Recovered: number;
    RecoveredDiff: number;
}

interface ICovidWidgetState {
    allStats: ICovidStats | null;
    activeTab: Tab;
}

interface ICovidWidgetProps {
    'data-link-to-details': string;
    'data-source-url': string;
}

enum Tab {
    World = 'World',
    Russia = 'Russia',
    Moscow = 'Moscow',
}

export class ExtKommersantCovidWidget extends React.Component<ICovidWidgetProps, ICovidWidgetState> {
    public state = {
        allStats: null,
        activeTab: Tab.Russia
    }

    private get lastUpdate(): string | null {
        const { allStats } = this.state as ICovidWidgetState;
        return allStats ? allStats.UpdatedAt || allStats.CreatedAt : null;
    }

    public constructor(props: ICovidWidgetProps) {
        super(props);
        this.handleTabSwitch = this.handleTabSwitch.bind(this);
    }

    public componentDidMount(): void {
        try {
            this.fetchStats().then(stats => {
                this.setState({
                    allStats: stats
                });
            });
        } catch (e) {
            console.error(e.message);
        }
    }

    public render(): React.ReactNode {
        const { allStats } = this.state;
        if (allStats) {
            const tabStats = this.getStatsForActiveTab(allStats);
            const lastUpdateDate = this.getLastUpdateDate();
            const lastUpdateTime = this.getLastUpdateTime();
            return (
                <div className="covid-stats-widget-wrapper">
                    <div className="covid-stats-widget">
                        <div className="covid-stats-widget__header">
                            <div className="covid-stats-widget__virus-icon" style={{ backgroundImage: 'url(https://im.kommersant.ru/ContentFlex/images/virus_icon.svg)' }} />
                            <div className="covid-stats-widget__caption">Статистика по коронавирусу COVID-19</div>
                        </div>
                        <div className="covid-stats-widget__tabs">
                            <div className={`covid-stats-widget__tab ${this.state.activeTab === Tab.World ? 'covid-stats-widget__tab_active' : ''}`} data-tab={Tab.World} onClick={this.handleTabSwitch}>Мир</div>
                            <div className={`covid-stats-widget__tab ${this.state.activeTab === Tab.Russia ? 'covid-stats-widget__tab_active' : ''}`} data-tab={Tab.Russia} onClick={this.handleTabSwitch}>Россия</div>
                            <div className={`covid-stats-widget__tab ${this.state.activeTab === Tab.Moscow ? 'covid-stats-widget__tab_active' : ''}`} data-tab={Tab.Moscow} onClick={this.handleTabSwitch}>Москва</div>
                        </div>
                        <div className="covid-stats-widget__subheaders">
                            <div className="covid-stats-widget__column-subheader">Заболели</div>
                            <div className="covid-stats-widget__column-subheader">Выздоровели</div>
                            <div className="covid-stats-widget__column-subheader">Умерли</div>
                        </div>
                        <div className="covid-stats-widget__body">
                            <div className="covid-stats-widget__column covid-stats-widget__column_infected">
                                <div className="covid-stats-widget__column-content">
                                    <div className="covid-stats-widget__column-content-header">{separateThousands(tabStats.Infected)} чел.</div>
                                    <div>+{separateThousands(tabStats.InfectedDiff)}</div>
                                    <div>(за сутки)</div>
                                </div>
                            </div>
                            <div className="covid-stats-widget__column covid-stats-widget__column_recovered">
                                <div className="covid-stats-widget__column-content">
                                    <div className="covid-stats-widget__column-content-header">{separateThousands(tabStats.Recovered)} чел.</div>
                                    <div>+{separateThousands(tabStats.RecoveredDiff)}</div>
                                    <div>(за сутки)</div>
                                </div>
                            </div>
                            <div className="covid-stats-widget__column covid-stats-widget__column_dead">
                                <div className="covid-stats-widget__column-content">
                                    <div className="covid-stats-widget__column-content-header">{separateThousands(tabStats.Dead)} чел.</div>
                                    <div>+{separateThousands(tabStats.DeadDiff)}</div>
                                    <div>(за сутки)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="covid-stats-widget-extra">
                        {lastUpdateDate && lastUpdateTime ? (
                            <div className="covid-stats-widget-extra__updated-at">
                                Данные обновлены {lastUpdateDate} в {lastUpdateTime} по московскому времени
                            </div>
                        ) : ''}
                        <div className="covid-stats-widget-extra__details-link-contaier">
                            <a className="covid-stats-widget-extra__details-link" href={this.props['data-link-to-details']}>Вся статистика, графики и карты</a>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    private fetchStats(): Promise<ICovidStats> {
        if (typeof window === 'undefined') {
            throw new Error('Window is not defined');
        } else {
            return new Promise(resolve => {
                fetch(this.props['data-source-url'])
                    .then((result: Response) => result.json())
                    .then(parsed => resolve(parsed.data[0]));
            });
        }
    }

    private getStatsForActiveTab(allStats: ICovidStats): ICovidArealStats {
        const { activeTab } = this.state;
        return {
            Infected: allStats[`${activeTab}Infected`],
            InfectedDiff: allStats[`${activeTab}InfectedDiff`],
            Dead: allStats[`${activeTab}Dead`],
            DeadDiff: allStats[`${activeTab}DeadDiff`],
            Recovered: allStats[`${activeTab}Recovered`],
            RecoveredDiff: allStats[`${activeTab}RecoveredDiff`]
        };
    }

    private getLastUpdateDate(): string | null {
        return this.lastUpdate ? getLocaleDate(this.lastUpdate) : null;
    }

    private getLastUpdateTime(): string | null {
        return this.lastUpdate ? getLocaleTime(this.lastUpdate) : null;
    }

    private handleTabSwitch(event: React.MouseEvent<HTMLDivElement>): void {
        const target = event.target as HTMLDivElement;
        const tab = target.getAttribute('data-tab') as Tab;
        if (tab) {
            this.switchTabTo(tab);
        }
    }

    private switchTabTo(newTab: Tab): void {
        this.setState({
            activeTab: newTab
        });
    }
}
